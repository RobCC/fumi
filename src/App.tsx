import { useCallback } from "react";
import { useStore } from "./store";
import Writer from "./components/Writer";
import Toolbar from "./components/Toolbar";
import NotesList from "./components/NotesList";
import "./App.css";

const contentStyle = { minHeight: "100%" } as const;

export default function App() {
  const view = useStore((s) => s.view);
  const showToolbar = useStore((s) => s.showToolbar);
  const hideToolbar = useStore((s) => s.hideToolbar);

  const handleContentClick = useCallback(() => {
    if (view === "write") {
      document.getElementById("writer-text")?.focus();
    }
  }, [view]);

  return (
    <div className="app">
      <div
        className="hover-zone"
        onMouseEnter={showToolbar}
        onMouseLeave={hideToolbar}
        onTouchStart={showToolbar}
      />
      <div onMouseEnter={showToolbar} onMouseLeave={hideToolbar} onTouchStart={showToolbar}>
        <Toolbar />
      </div>

      <div
        style={contentStyle}
        onTouchStart={hideToolbar}
        onClick={handleContentClick}
      >
        {view === "notes" ? <NotesList /> : <Writer />}
      </div>
    </div>
  );
}
