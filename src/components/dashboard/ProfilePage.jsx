import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { getPastUserRuns } from "../../services/firestoreService";
import {
  User,
  Camera,
  MapPin,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Award,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const CITY_OPTIONS = [
  { value: "new_york", label: "New York" },
  { value: "washington_dc", label: "Washington DC" },
  { value: "boston", label: "Boston" },
  { value: "atlanta", label: "Atlanta" },
  { value: "london", label: "London" },
];

const AVATAR_COLORS = [
  "var(--lrc-teal)",
  "var(--lrc-orange)",
  "var(--lrc-purple)",
  "var(--lrc-olive)",
  "var(--lrc-pink)",
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?";
}

export default function ProfilePage() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    city: userProfile?.city || "new_york",
  });

  const [pastRuns, setPastRuns] = useState([]);
  const [loadingRuns, setLoadingRuns] = useState(true);

  useEffect(() => {
    async function fetchPastRuns() {
      if (!currentUser?.uid) return;
      try {
        const runs = await getPastUserRuns(currentUser.uid);
        setPastRuns(runs);
      } catch (err) {
        console.error("Failed to fetch past runs", err);
      } finally {
        setLoadingRuns(false);
      }
    }
    fetchPastRuns();
  }, [currentUser]);

  const firstName =
    userProfile?.firstName ||
    currentUser?.displayName?.split(" ")[0] ||
    "Runner";
  const lastName = userProfile?.lastName || "";
  const photoURL = userProfile?.photoURL || currentUser?.photoURL;
  const initials = getInitials(firstName, lastName);
  const avatarColor = getAvatarColor(firstName);

  const handleEdit = () => {
    setFormData({
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      city: userProfile?.city || "new_york",
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(formData);
      setEditing(false);
      toast.success("Profile updated! 🎉");
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile-photos/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateUserProfile({ photoURL: downloadURL });
      toast.success("Profile photo updated! 📸");
    } catch (err) {
      toast.error("Failed to upload photo");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleStravaConnect = () => {
    // Strava OAuth redirect
    const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID;
    if (!clientId) {
      toast.error(
        "Strava integration not configured yet. Add VITE_STRAVA_CLIENT_ID to .env",
      );
      return;
    }
    const redirectUri = `${window.location.origin}/dashboard/profile`;
    const scope = "read,activity:read";
    const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = url;
  };

  const joinedDate = userProfile?.joinedAt?.toDate?.()
    ? format(userProfile.joinedAt.toDate(), "MMMM yyyy")
    : "Recently";

  const cityLabel =
    CITY_OPTIONS.find((c) => c.value === (userProfile?.city || "new_york"))
      ?.label || "Unknown";

  return (
    <div>
      <h1 className="page-title">
        <User
          size={24}
          style={{
            display: "inline",
            verticalAlign: "middle",
            marginRight: 8,
            color: "var(--lrc-teal)",
          }}
        />
        My Profile
      </h1>
      <p className="page-subtitle">
        Manage your profile, connect Strava, and track your journey.
      </p>

      {/* Profile Header */}
      <div className="dash-card" style={{ marginBottom: 24 }}>
        <div className="profile-header">
          <div
            className="profile-avatar-large"
            style={{ background: photoURL ? "transparent" : avatarColor }}
            onClick={() => fileInputRef.current?.click()}
          >
            {photoURL ? <img src={photoURL} alt={firstName} /> : initials}
            <div className="profile-avatar-upload">
              {uploading ? "..." : <Camera size={24} />}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="profile-info">
            <h2>
              {firstName} {lastName}
            </h2>
            <p>
              <MapPin
                size={14}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 4,
                }}
              />
              {cityLabel} • Member since {joinedDate}
            </p>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Personal Info Section */}
        <div className="dash-card">
          <div className="profile-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0, border: "none", padding: 0 }}>
                Personal Information
              </h3>
              {!editing ? (
                <button
                  className="btn-secondary"
                  onClick={handleEdit}
                  style={{ padding: "6px 14px", fontSize: 13 }}
                >
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: "6px 14px", fontSize: 13 }}
                  >
                    <Save size={14} /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleCancel}
                    style={{
                      padding: "6px 14px",
                      fontSize: 13,
                      borderColor: "var(--lrc-pink)",
                      color: "var(--lrc-pink)",
                    }}
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={
                    editing ? formData.firstName : userProfile?.firstName || ""
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={!editing}
                />
              </div>
              <div className="profile-form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={
                    editing ? formData.lastName : userProfile?.lastName || ""
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={!editing}
                />
              </div>
              <div className="profile-form-group">
                <label>Email</label>
                <input type="email" value={currentUser?.email || ""} disabled />
              </div>
              <div className="profile-form-group">
                <label>City Chapter</label>
                <select
                  value={
                    editing ? formData.city : userProfile?.city || "new_york"
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  disabled={!editing}
                >
                  {CITY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="dash-card">
          <div className="profile-section">
            <h3>Your Stats</h3>
            <div
              className="stats-strip"
              style={{ gridTemplateColumns: "1fr 1fr", margin: 0 }}
            >
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "var(--lrc-teal-light)",
                    color: "var(--lrc-teal)",
                  }}
                >
                  <CheckCircle size={20} />
                </div>
                <div className="stat-value">
                  {userProfile?.runsAttended || 0}
                </div>
                <div className="stat-label">Runs Attended</div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "var(--lrc-orange-light)",
                    color: "var(--lrc-orange)",
                  }}
                >
                  <Award size={20} />
                </div>
                <div className="stat-value">
                  {userProfile?.totalDistanceKm || 0}
                </div>
                <div className="stat-label">KM Logged</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Runs Section */}
      <div className="dash-card" style={{ marginTop: 24 }}>
        <div className="profile-section">
          <h3>Run History</h3>
          {loadingRuns ? (
            <p style={{ color: "var(--lrc-text-muted)" }}>
              Loading past runs...
            </p>
          ) : pastRuns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">📅</div>
              <h3>No past runs</h3>
              <p>
                You haven't attended any runs yet. Sign up for an upcoming run!
              </p>
            </div>
          ) : (
            <div
              className="run-history-list"
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {pastRuns.map((run) => (
                <div
                  key={run.id}
                  className="run-item"
                  style={{
                    borderBottom: "1px solid var(--lrc-border)",
                    paddingBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div className="run-date-badge">
                    <span className="run-date-month">
                      {run.date?.toDate
                        ? format(run.date.toDate(), "MMM")
                        : "---"}
                    </span>
                    <span className="run-date-day">
                      {run.date?.toDate ? format(run.date.toDate(), "d") : "--"}
                    </span>
                  </div>
                  <div className="run-info" style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: "1rem" }}>
                      {run.location || "Group Run"}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        marginTop: 4,
                        display: "flex",
                        gap: "12px",
                        color: "var(--lrc-text-secondary)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>
                        <MapPin
                          size={12}
                          style={{ display: "inline", marginRight: 4 }}
                        />
                        {run.distanceKm || 0} km
                      </span>
                      <span>
                        <Calendar
                          size={12}
                          style={{ display: "inline", marginRight: 4 }}
                        />
                        {run.time || "TBD"}
                      </span>
                    </p>
                  </div>
                  <div
                    className="run-status"
                    style={{
                      color: "var(--lrc-teal)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <CheckCircle size={14} /> Completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strava Integration */}
      <div className="dash-card" style={{ marginTop: 24 }}>
        <div className="profile-section" style={{ marginBottom: 0 }}>
          <h3>Strava Integration</h3>

          {userProfile?.stravaConnected ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  color: "var(--lrc-olive)",
                }}
              >
                <CheckCircle size={16} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  Connected to Strava
                </span>
              </div>
              <div className="strava-stats-grid">
                <div className="stat-card">
                  <div className="stat-value">
                    {userProfile?.stravaActivities || 0}
                  </div>
                  <div className="stat-label">Activities</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {userProfile?.stravaTotalKm || 0}
                  </div>
                  <div className="stat-label">Total KM</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {userProfile?.stravaAvgPace || "—"}
                  </div>
                  <div className="stat-label">Avg Pace</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p
                style={{
                  color: "var(--lrc-text-secondary)",
                  marginBottom: 16,
                  fontSize: 14,
                }}
              >
                Connect your Strava account to automatically sync your running
                data and see detailed stats.
              </p>
              <button
                className="strava-connect-btn"
                onClick={handleStravaConnect}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                Connect with Strava
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
