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

const MAX_LINES = 7;

export default function Writer() {
  const text = useStore((s) => s.note.text);
  const setText = useStore((s) => s.setText);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    textAreaRef.current?.scrollTo({
      top: textAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [text, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const lineCount = (text.match(/\n/g) || []).length + 1;
  // const emptyLines = Math.max(0, Math.min(Math.floor(MAX_LINES / 2), MAX_LINES - lineCount));
  const emptyLines = Math.max(0, MAX_LINES - lineCount);

  return (
    <>
      <div className="writer">
        <div className="writer-inner">
          <div className="writer-fade" aria-hidden="true" />
          <textarea
            placeholder="..."
            id="writer-text"
            className="text-area"
            tabIndex={0}
            spellCheck={false}
            value={text}
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onContextMenu={handleContextMenu}
            ref={textAreaRef}
            style={{
              paddingTop: `calc(var(--text-line-height) * ${emptyLines}rem)`,
            }}
          ></textarea>
        </div>
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
