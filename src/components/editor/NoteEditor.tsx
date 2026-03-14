import { useState, useCallback } from "react";
// 1. Fixed Type-only imports
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { Block } from "@blocknote/core";
import type { Note } from "../../store/notesSlice";

import "@blocknote/mantine/style.css";
import useAutoSave from "../../hooks/useAutoSave";
import TagInput from "./TagInput";

interface NoteEditorProps {
  note: Note;
}

export default function NoteEditor({ note }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState<Block[]>(note.content);

  const editor = useCreateBlockNote({
    initialContent: note.content.length ? note.content : undefined,
  });

  const handleEditorChange = useCallback(() => {
    // We update local state so useAutoSave picks up the changes
    setContent(editor.document);
  }, [editor]);

  useAutoSave(note.id, title, content);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "32px 54px 8px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          style={{
            width: "100%",
            fontSize: 32,
            fontWeight: 700,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#111827",
            marginBottom: 6,
          }}
        />
        <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
          Last updated {new Date(note.updatedAt).toLocaleString()}
        </p>
      </div>

      <TagInput noteId={note.id} tags={note.tags} />

      <div style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
        <BlockNoteView
          editor={editor}
          onChange={handleEditorChange}
          theme="light"
        />
      </div>
    </div>
  );
}
