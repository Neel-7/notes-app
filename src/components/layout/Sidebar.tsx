import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logOut } from "../../store/authSlice";
import {
  setActiveNote,
  createNote,
  deleteNote,
  type Note,
} from "../../store/notesSlice";
import { setSearchQuery, toggleSidebar } from "../../store/uiSlice";
import { setActiveTag, type Tag } from "../../store/tagsSlice";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const notes = useAppSelector((s) => s.notes.items);
  const activeNoteId = useAppSelector((s) => s.notes.activeNoteId);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);
  const tags = useAppSelector((s) => s.tags.items);
  const activeTagId = useAppSelector((s) => s.tags.activeTagId);

  const filtered = notes.filter((n: Note) => {
    const matchesSearch = n.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTag = activeTagId
      ? n.tags.includes(tags.find((t) => t.id === activeTagId)?.name ?? "")
      : true;
    return matchesSearch && matchesTag;
  });

  return (
    <aside
      style={{
        width: 260,
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>📝 Notes</strong>
        <button
          onClick={() => dispatch(toggleSidebar())}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ✕
        </button>
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
            fontSize: 13,
          }}
        />
      </div>

      {/* New Note */}
      <div style={{ padding: "0 16px 8px" }}>
        <button
          onClick={() => user && dispatch(createNote(user.uid))}
          style={{
            width: "100%",
            padding: 8,
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          + New Note
        </button>
      </div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <div style={{ padding: "0 16px 8px" }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 11,
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Tags
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {tags.map((tag: Tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  dispatch(setActiveTag(activeTagId === tag.id ? null : tag.id))
                }
                style={{
                  padding: "2px 8px",
                  borderRadius: 99,
                  fontSize: 12,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: activeTagId === tag.id ? "#3b82f6" : "#e5e7eb",
                  background:
                    activeTagId === tag.id ? "#eff6ff" : "transparent",
                  color: activeTagId === tag.id ? "#3b82f6" : "#6b7280",
                }}
              >
                #{tag.name}{" "}
                <span style={{ color: "#9ca3af" }}>{tag.noteCount}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Note List */}
      <div
        style={{ flex: 1, overflowY: "auto", borderTop: "1px solid #f3f4f6" }}
      >
        {filtered.length === 0 && (
          <p style={{ padding: 16, color: "#9ca3af", fontSize: 14 }}>
            No notes found.
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
            <div style={{ overflow: "hidden", flex: 1 }}>
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
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
              {note.tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    marginTop: 4,
                    flexWrap: "wrap",
                  }}
                >
                  {note.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        color: "#3b82f6",
                        background: "#eff6ff",
                        borderRadius: 99,
                        padding: "1px 6px",
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
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
                flexShrink: 0,
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
        <p
          style={{
            margin: "0 0 8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.email}
        </p>
        <button
          onClick={() => dispatch(logOut())}
          style={{
            color: "#ef4444",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontSize: 13,
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
