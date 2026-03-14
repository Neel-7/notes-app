import { useAppSelector } from "../store/hooks";

export default function NotesPage() {
  const activeNoteId = useAppSelector((s) => s.notes.activeNoteId);
  const allNotes = useAppSelector((s) => s.notes.items);
  const note = useAppSelector((s) =>
    s.notes.items.find((n) => n.id === activeNoteId),
  );

  console.log("=== NotesPage ===");
  console.log("activeNoteId:", activeNoteId);
  console.log("allNotes:", allNotes);
  console.log("note:", note);

  if (!activeNoteId || !note) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#9ca3af",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48 }}>📝</p>
          <p style={{ fontSize: 18 }}>Select a note or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        {note.title || "Untitled"}
      </h1>
      <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 32 }}>
        Last updated {new Date(note.updatedAt).toLocaleString()}
      </p>
      <p style={{ color: "#6b7280" }}>
        ✏️ BlockNote editor goes here — next step
      </p>
    </div>
  );
}
