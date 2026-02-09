import { useEffect, useRef, useCallback } from "react";
import { useStore } from "../store";
import "./Writer.css";

const BLOCKED_KEYS = new Set([
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

export default function Writer() {
  const text = useStore((s) => s.note.text);
  const setText = useStore((s) => s.setText);

  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [text, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (BLOCKED_KEYS.has(e.key)) {
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "y")) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      setText(text + "\n");
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setText(text + e.key);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const renderChars = () => {
    return text.split("").map((char, i) => (
      <span key={i} className="writer-char">
        {char}
      </span>
    ));
  };

  return (
    <>
      <div
        ref={containerRef}
        className="writer"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onContextMenu={handleContextMenu}
      >
        {text.length === 0 && <span className="writer-placeholder"></span>}
        <div id="writer-text" className="writer-text" tabIndex={0}>
          {renderChars()}
          <span className="writer-cursor" />
        </div>
        <div ref={endRef} />
      </div>
      {wordCount > 0 && (
        <div className="word-count">
          {wordCount}
          {/* {wordCount} {wordCount === 1 ? "word" : "words"} */}
        </div>
      )}
    </>
  );
}
