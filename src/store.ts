import { create } from "zustand";
import type { Note, Theme, View } from "./types";
import * as storage from "./utils/storage";
import { nextTheme } from "./utils/themes";
import { exportAsText } from "./utils/export";

function createNote(): Note {
  const now = new Date().toISOString();
  return {
    id: Date.now().toString(),
    text: "",
    createdAt: now,
    updatedAt: now,
  };
}

interface AppState {
  theme: Theme;
  view: View;
  note: Note;
  notes: Note[];
  toolbarVisible: boolean;
  _hideTimer: number;

  cycleTheme: () => void;
  setText: (text: string) => void;
  newNote: () => void;
  showNotes: () => void;
  backToWrite: () => void;
  selectNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  exportNote: () => void;
  showToolbar: () => void;
  hideToolbar: () => void;
}

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

function updateNote(note: Note) {
  if (note.text.length === 0) {
    return;
  }

  const updatedStorage = { ...note, updatedAt: new Date().toISOString() };
  storage.saveNote(updatedStorage);

  return updatedStorage;
}

export const useStore = create<AppState>((set, get) => ({
  theme: storage.loadTheme(),
  view: "write",
  note: createNote(),
  notes: storage.loadNotes(),
  toolbarVisible: false,
  _hideTimer: 0,

  cycleTheme: () => {
    const next = nextTheme(get().theme);
    document.documentElement.setAttribute("data-theme", next);
    storage.saveTheme(next);
    set({ theme: next });
  },

  setText: (text: string) => {
    set((s) => ({ note: { ...s.note, text } }));

    if (autoSaveTimer) {
      window.clearTimeout(autoSaveTimer);
    }

    autoSaveTimer = window.setTimeout(() => {
      const { note } = get();
      const updatedStorage = updateNote(note);

      if (updatedStorage) {
        set((s) => ({
          note: updatedStorage,
          notes: s.notes.some((n) => n.id === updatedStorage.id)
            ? s.notes.map((n) => (n.id === updatedStorage.id ? updatedStorage : n))
            : [...s.notes, updatedStorage],
        }));
      }
    }, 1000);
  },

  newNote: () => {
    if (autoSaveTimer) {
      window.clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }
    set({ note: createNote(), view: "write" });
  },

  showNotes: () => {
    const { note } = get();
    updateNote(note);

    set({ notes: storage.loadNotes(), view: "notes" });
  },

  backToWrite: () => {
    set({ view: "write" });
  },

  selectNote: (selected: Note) => {
    set({ note: selected, view: "write" });
  },

  deleteNote: (id: string) => {
    storage.deleteNote(id);
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
  },

  exportNote: () => {
    const { note } = get();
    const date = new Date(note.createdAt).toISOString().slice(0, 10);
    exportAsText(note.text, `fumi-${date}.txt`);
  },

  showToolbar: () => {
    const { _hideTimer } = get();
    window.clearTimeout(_hideTimer);
    set({ toolbarVisible: true });
  },

  hideToolbar: () => {
    const timer = window.setTimeout(() => {
      set({ toolbarVisible: false });
    }, 750);
    set({ _hideTimer: timer });
  },
}));

// Apply initial theme on load
document.documentElement.setAttribute("data-theme", useStore.getState().theme);
