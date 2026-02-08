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
  const isReview = useStore((s) => s.view === "review");
  const setText = useStore((s) => s.setText);

  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isReview) {
      containerRef.current?.focus();
    }
  }, [isReview]);

  useEffect(() => {
    scrollToBottom();
  }, [text, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isReview) return;

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
    if (!isReview) {
      e.preventDefault();
    }
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
        className={`writer${isReview ? " writer--review" : ""}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onContextMenu={handleContextMenu}
      >
        {text.length === 0 && !isReview && (
          <span className="writer-placeholder">Just start writing...</span>
        )}
        <div className="writer-text">
          {renderChars()}
          {!isReview && <span className="writer-cursor" />}
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
