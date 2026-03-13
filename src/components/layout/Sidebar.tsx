import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logOut } from "../../store/authSlice";
import {
  setActiveNote,
  createNote,
  deleteNote,
  type Note,
} from "../../store/notesSlice";
import { setSearchQuery, toggleSidebar } from "../../store/uiSlice";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const notes = useAppSelector((s) => s.notes.items);
  const activeNoteId = useAppSelector((s) => s.notes.activeNoteId);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  const filtered = notes.filter((n: Note) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!sidebarOpen)
    return (
      <button
        onClick={() => dispatch(toggleSidebar())}
        style={{ padding: 8, margin: 8 }}
      >
        ☰
      </button>
    );

  return (
    <aside
      style={{
        width: 260,
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong>📝 Notes</strong>
        <button onClick={() => dispatch(toggleSidebar())}>✕</button>
      </div>

      {/* Search */}
      <div style={{ padding: "8px 16px" }}>
        <input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* New Note */}
      <div style={{ padding: "0 16px 8px" }}>
        <button
          onClick={() => user && dispatch(createNote(user.uid))}
          style={{
            width: "100%",
            padding: "8px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          + New Note
        </button>
      </div>

      {/* Note List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.length === 0 && (
          <p style={{ padding: "16px", color: "#9ca3af", fontSize: 14 }}>
            No notes yet.
          </p>
        )}
        {filtered.map((note: Note) => (
          <div
            key={note.id}
            onClick={() => dispatch(setActiveNote(note.id))}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              background: activeNoteId === note.id ? "#eff6ff" : "transparent",
              borderLeft:
                activeNoteId === note.id
                  ? "3px solid #3b82f6"
                  : "3px solid transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  margin: 0,
                  fontWeight: 500,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {note.title || "Untitled"}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteNote(note.id));
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#ef4444",
                fontSize: 16,
                padding: "0 4px",
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid #e5e7eb",
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>{user?.email}</p>
        <button
          onClick={() => dispatch(logOut())}
          style={{
            color: "#ef4444",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
