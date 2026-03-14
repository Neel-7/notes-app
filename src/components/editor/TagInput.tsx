import { useState, type KeyboardEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addTagToNote, removeTagFromNote } from "../../store/tagsSlice";

interface TagInputProps {
  noteId: string;
  tags: string[];
}

export default function TagInput({ noteId, tags }: TagInputProps) {
  const dispatch = useAppDispatch();
  const uid = useAppSelector((s) => s.auth.user?.uid);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed || !uid || tags.includes(trimmed)) {
      setInput("");
      return;
    }
    dispatch(addTagToNote({ tagName: trimmed, noteId, uid }));
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      const last = tags[tags.length - 1];
      if (uid) dispatch(removeTagFromNote({ tagName: last, noteId, uid }));
    }
  };

  const handleRemove = (tag: string) => {
    if (uid) dispatch(removeTagFromNote({ tagName: tag, noteId, uid }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        padding: "8px 54px",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "#eff6ff",
            color: "#3b82f6",
            borderRadius: 99,
            padding: "2px 10px",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          #{tag}
          <button
            onClick={() => handleRemove(tag)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#93c5fd",
              fontSize: 14,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleAdd}
        placeholder={tags.length === 0 ? "Add tags..." : ""}
        style={{
          border: "none",
          outline: "none",
          fontSize: 13,
          color: "#6b7280",
          background: "transparent",
          minWidth: 80,
        }}
      />
    </div>
  );
}
