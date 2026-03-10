import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, MapPin, Globe, Trophy, User, LogOut, Menu } from "lucide-react";
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

const NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/dashboard/city", icon: MapPin, label: "My City" },
  { to: "/dashboard/explore", icon: Globe, label: "Explore" },
  { to: "/dashboard/races", icon: Trophy, label: "Races" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function DashboardLayout() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

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
            {photoURL ? (
              <img
                src={photoURL}
                alt={firstName}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              initials
            )}
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
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
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

      {/* ─── Mobile Header ─── */}
      <div className="mobile-header">
        <span className="mobile-header-brand">LRC</span>
        <div
          className="mobile-header-avatar"
          style={{ background: avatarColor }}
        >
          {photoURL ? (
            <img
              src={photoURL}
              alt={firstName}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            initials
          )}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="dashboard-main">
        <Outlet />
      </main>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
