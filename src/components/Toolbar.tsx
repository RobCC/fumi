import { useCallback } from "react";
import { useStore } from "../store";
import "./Toolbar.css";

const ThemeSwitchButton = () => {
  const cycleTheme = useStore((s) => s.cycleTheme);

  return (
    <button onClick={cycleTheme} title="Theme">
      ◑
    </button>
  );
};

export default function Toolbar() {
  const view = useStore((s) => s.view);
  const hasText = useStore((s) => s.note.text.length > 0);
  const toolbarVisible = useStore((s) => s.toolbarVisible);
  const newNote = useStore((s) => s.newNote);
  const backToWrite = useStore((s) => s.backToWrite);
  const showNotes = useStore((s) => s.showNotes);
  const exportNote = useStore((s) => s.exportNote);
  // always show toolbar in notes view
  const visible = view !== "write" || toolbarVisible;

  const handleNewNote = useCallback(() => {
    newNote();
    document.getElementById("writer-text")?.focus();
  }, [newNote]);

  return (
    <div className={`toolbar${visible ? " toolbar--visible" : ""}`}>
      <div className="toolbar-brand">fumi</div>
      <div className="toolbar-actions">
        {view === "write" && (
          <>
            {hasText && <button onClick={exportNote} title="Export">↓</button>}
            {hasText && <button onClick={handleNewNote} title="New note">+</button>}
            <button onClick={showNotes} title="Notes">☰</button>
            <ThemeSwitchButton />
          </>
        )}
        {view === "notes" && (
          <>
            <button onClick={backToWrite} title="Write">✎</button>
            <ThemeSwitchButton />
          </>
        )}
      </div>
    </div>
  );
}
