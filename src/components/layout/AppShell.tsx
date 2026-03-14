import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSelector } from "../../store/hooks";
import { useAppDispatch } from "../../store/hooks";
import { toggleSidebar } from "../../store/uiSlice";

export default function AppShell() {
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {sidebarOpen && <Sidebar />}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100vh",
        }}
      >
        {!sidebarOpen && (
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #e5e7eb",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => dispatch(toggleSidebar())}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 20,
              }}
            >
              ☰
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflow: "auto", height: "100%" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
