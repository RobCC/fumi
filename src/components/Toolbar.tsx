import { useStore } from "../store";
import "./Toolbar.css";

const ThemeSwitchButton = () => {
  const theme = useStore((s) => s.theme);
  const cycleTheme = useStore((s) => s.cycleTheme);

  return (
    <>
      <div className="toolbar-divider" />
      <button onClick={cycleTheme}>
        <span className="theme-label">{theme}</span>
      </button>
    </>
  );
};

export default function Toolbar() {
  const view = useStore((s) => s.view);
  const hasText = useStore((s) => s.note.text.length > 0);
  const toolbarVisible = useStore((s) => s.toolbarVisible);
  const newNote = useStore((s) => s.newNote);
  const finish = useStore((s) => s.finish);
  const backToWrite = useStore((s) => s.backToWrite);
  const showNotes = useStore((s) => s.showNotes);
  const exportNote = useStore((s) => s.exportNote);
  const continueWriting = useStore((s) => s.continueWriting);

  // always show toolbar in notes/review view
  const visible = view !== "write" || toolbarVisible;

  return (
    <div className={`toolbar${visible ? " toolbar--visible" : ""}`}>
      <div className="toolbar-brand">fumi</div>
      <div className="toolbar-actions">
        {view === "write" && (
          <>
            {hasText && <button onClick={finish}>Finish</button>}
            <button onClick={showNotes}>Notes</button>
            <ThemeSwitchButton />
          </>
        )}
        {view === "review" && (
          <>
            <button onClick={continueWriting}>Continue</button>
            <button onClick={exportNote}>Export .txt</button>
            <button onClick={newNote}>New note</button>
            <button onClick={showNotes}>Notes</button>
            <ThemeSwitchButton />
          </>
        )}
        {view === "notes" && (
          <>
            <button onClick={backToWrite}>Write</button>
            <ThemeSwitchButton />
          </>
        )}
      </div>
    </div>
  );
}
