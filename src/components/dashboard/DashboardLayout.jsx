import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  MapPin,
  Globe,
  Trophy,
  User,
  LogOut,
  Award,
  Menu,
  QrCode,
  X,
  Download,
} from "lucide-react";
import QRCode from "react-qr-code";
import "../../style/dashboard.css";

const CITY_NAMES = {
  new_york: "New York",
  washington_dc: "Washington DC",
  boston: "Boston",
  atlanta: "Atlanta",
  london: "London",
};

const AVATAR_COLORS = [
  "var(--lrc-teal)",
  "var(--lrc-orange)",
  "var(--lrc-purple)",
  "var(--lrc-olive)",
  "var(--lrc-pink)",
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getInitials(firstName, lastName) {
  const f = firstName?.[0] || "";
  const l = lastName?.[0] || "";
  return (f + l).toUpperCase() || "?";
}

// All nav items — used in sidebar and drawer
const ALL_NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/dashboard/city", icon: MapPin, label: "My City" },
  { to: "/dashboard/explore", icon: Globe, label: "Explore" },
  { to: "/dashboard/races", icon: Trophy, label: "Races" },
  { to: "/dashboard/leaderboard", icon: Award, label: "Leaderboard" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

// 4 items shown in mobile bottom nav (QR occupies center slot)
const MOBILE_NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/dashboard/races", icon: Trophy, label: "Races" },
  { to: "/dashboard/leaderboard", icon: Award, label: "Board" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function DashboardLayout() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const firstName =
    userProfile?.firstName ||
    currentUser?.displayName?.split(" ")[0] ||
    "Runner";
  const lastName =
    userProfile?.lastName ||
    currentUser?.displayName?.split(" ").slice(1).join(" ") ||
    "";
  const city = userProfile?.city || "new_york";
  const initials = getInitials(firstName, lastName);
  const avatarColor = getAvatarColor(firstName);
  const photoURL = userProfile?.photoURL || currentUser?.photoURL;

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleLogout = async () => {
    try {
      setDrawerOpen(false);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("layout-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const a = document.createElement("a");
      a.download = `lrc-qr-${currentUser?.uid?.slice(0, 8) || "user"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  };

  const avatarImg = () =>
    photoURL ? (
      <img
        src={photoURL}
        alt={firstName}
        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
      />
    ) : null;

  return (
    <div className="dashboard-shell">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="dashboard-sidebar">
        <NavLink to="/" className="sidebar-brand">
          <img
            src="/src/images/logo.png"
            alt="LRC"
            className="sidebar-brand-icon"
          />
          <span className="sidebar-brand-text">Latin Run Club</span>
        </NavLink>

        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: avatarColor }}>
            {avatarImg() || initials}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {firstName} {lastName}
            </div>
            <div className="sidebar-user-city">
              <MapPin size={12} />
              {CITY_NAMES[city] || city}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {ALL_NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ─── Slide Drawer Overlay ─── */}
      {drawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ─── Slide Drawer ─── */}
      <div className={`mobile-drawer${drawerOpen ? " open" : ""}`}>
        <div className="mobile-drawer-header">
          <div
            className="mobile-drawer-avatar"
            style={{ background: photoURL ? "transparent" : avatarColor }}
          >
            {avatarImg() || initials}
          </div>
          <div className="mobile-drawer-user-info">
            <div className="mobile-drawer-name">
              {firstName} {lastName}
            </div>
            <div className="mobile-drawer-city">
              <MapPin size={12} />
              {CITY_NAMES[city] || city}
            </div>
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          {ALL_NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-drawer-link${isActive ? " active" : ""}`
              }
              onClick={() => setDrawerOpen(false)}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mobile-drawer-footer">
          <button className="mobile-drawer-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {/* ─── Mobile Header ─── */}
      <div className="mobile-header">
        <button
          className="mobile-header-hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="mobile-header-brand">LRC</span>
        <div
          className="mobile-header-avatar"
          style={{ background: photoURL ? "transparent" : avatarColor }}
        >
          {avatarImg() || initials}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="dashboard-main">
        <Outlet />
      </main>

      {/* ─── Mobile Bottom Nav (5 slots: 2 + QR + 2) ─── */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {MOBILE_NAV_ITEMS.slice(0, 2).map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}

          {/* Center QR button */}
          <button
            className="mobile-nav-qr-btn"
            onClick={() => setQrModalOpen(true)}
            aria-label="Show my QR code"
          >
            <QrCode size={26} />
          </button>

          {MOBILE_NAV_ITEMS.slice(2).map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ─── QR Full-Screen Modal ─── */}
      {qrModalOpen && (
        <div
          className="qr-fullscreen-overlay"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="qr-fullscreen-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="qr-fullscreen-close"
              onClick={() => setQrModalOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h2 className="qr-fullscreen-title">My QR Code</h2>
            <p className="qr-fullscreen-subtitle">
              Show this at races so the admin can confirm your attendance.
            </p>
            <div className="qr-fullscreen-code">
              <QRCode
                id="layout-qr-code"
                value={currentUser?.uid || "unknown"}
                size={240}
              />
            </div>
            <button
              className="btn-primary qr-fullscreen-download"
              onClick={handleDownloadQR}
            >
              <Download size={16} /> Download QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
