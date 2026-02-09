import { useStore } from "./store";
import Writer from "./components/Writer";
import Toolbar from "./components/Toolbar";
import NotesList from "./components/NotesList";
import "./App.css";

export default function App() {
  const view = useStore((s) => s.view);
  const showToolbar = useStore((s) => s.showToolbar);
  const hideToolbar = useStore((s) => s.hideToolbar);

  return (
    <div className="app">
      <div
        className="hover-zone"
        onMouseEnter={showToolbar}
        onMouseLeave={hideToolbar}
      />
      <div onMouseEnter={showToolbar} onMouseLeave={hideToolbar}>
        <Toolbar />
      </div>

      {view === "notes" ? <NotesList /> : <Writer />}
    </div>
  );
}
