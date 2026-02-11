import { useStore } from "../store";
import "./NotesList.css";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function NotesList() {
  const notes = useStore((s) => s.notes);
  const selectNote = useStore((s) => s.selectNote);
  const deleteNote = useStore((s) => s.deleteNote);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNote(id);
  };

  return (
    <div className="notes-list">
      <h2>Notes</h2>
      {notes.length === 0 && <p className="notes-empty">No notes yet.</p>}
      {notes.map((note) => (
        <div
          key={note.id}
          className="note-item"
          onClick={() => selectNote(note)}
        >
          <div className="note-preview">
            {note.text.slice(0, 120) || "(empty)"}
          </div>
          <div className="note-meta">
            <span>
              {formatDate(note.createdAt)} &middot; {wordCount(note.text)} words
            </span>
            <button
              className="note-delete"
              onClick={(e) => handleDelete(e, note.id)}
              aria-label="Delete note"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
