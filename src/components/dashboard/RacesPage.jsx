import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getRaces,
  toggleRaceParticipation,
} from "../../services/firestoreService";
import {
  Trophy,
  Calendar,
  MapPin,
  Filter,
  Users,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const AVATAR_COLORS = [
  "var(--lrc-teal)",
  "var(--lrc-orange)",
  "var(--lrc-purple)",
  "var(--lrc-olive)",
  "var(--lrc-pink)",
];

const DISTANCE_OPTIONS = [
  "All",
  "5K",
  "10K",
  "Half Marathon",
  "Marathon",
  "Ultra",
];

const CITY_OPTIONS = [
  { value: "", label: "All Cities" },
  { value: "new_york", label: "New York" },
  { value: "washington_dc", label: "Washington DC" },
  { value: "boston", label: "Boston" },
  { value: "atlanta", label: "Atlanta" },
  { value: "london", label: "London" },
];

export default function RacesPage() {
  const { currentUser } = useAuth();
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState("");
  const [filterDistance, setFilterDistance] = useState("All");
  const [toggleLoading, setToggleLoading] = useState({});

  useEffect(() => {
    loadRaces();
  }, [filterCity]);

  async function loadRaces() {
    setLoading(true);
    try {
      const filters = {};
      if (filterCity) filters.city = filterCity;
      const data = await getRaces(filters);
      setRaces(data);
    } catch (err) {
      console.error("Races load error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = useCallback(
    async (raceId) => {
      if (toggleLoading[raceId]) return;
      setToggleLoading((prev) => ({ ...prev, [raceId]: true }));
      try {
        const added = await toggleRaceParticipation(raceId, currentUser.uid);
        setRaces((prev) =>
          prev.map((r) => {
            if (r.id !== raceId) return r;
            const participants = r.participants || [];
            return {
              ...r,
              participants: added
                ? [...participants, currentUser.uid]
                : participants.filter((id) => id !== currentUser.uid),
            };
          }),
        );
        toast.success(added ? "🎉 You're running this!" : "Removed from race");
      } catch (err) {
        toast.error("Couldn't update. Try again.");
      } finally {
        setToggleLoading((prev) => ({ ...prev, [raceId]: false }));
      }
    },
    [currentUser, toggleLoading],
  );

  // Client-side distance filter
  const filteredRaces = races.filter((r) => {
    if (filterDistance === "All") return true;
    return r.distance === filterDistance;
  });

  if (loading) {
    return (
      <div>
        <div className="skeleton skeleton-title" style={{ width: "40%" }}></div>
        <div className="race-grid" style={{ marginTop: 20 }}>
          {[1, 2, 3].map((i) => (
            <div
              className="skeleton skeleton-card"
              key={i}
              style={{ height: 220 }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">
        <Trophy
          size={24}
          style={{
            display: "inline",
            verticalAlign: "middle",
            marginRight: 8,
            color: "var(--lrc-orange)",
          }}
        />
        Races & Events
      </h1>
      <p className="page-subtitle">
        Find upcoming races, see who from the club is running, and sign up
        together. ¡A correr!
      </p>

      {/* Filters */}
      <div className="filter-bar">
        <select
          className="filter-select"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
        >
          {CITY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filterDistance}
          onChange={(e) => setFilterDistance(e.target.value)}
        >
          {DISTANCE_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Race Cards */}
      {filteredRaces.length === 0 ? (
        <div className="dash-card">
          <div className="empty-state">
            <div className="empty-state-emoji">🏅</div>
            <h3>No races found</h3>
            <p>
              Try adjusting your filters, or check back soon for new events!
            </p>
          </div>
        </div>
      ) : (
        <div className="race-grid">
          {filteredRaces.map((race) => {
            const isRunning = race.participants?.includes(currentUser?.uid);
            const raceDate = race.date?.toDate?.();
            const participantCount = race.participants?.length || 0;

            return (
              <div className="race-card" key={race.id}>
                <div className="race-card-header">
                  <div>
                    <span className="race-distance-badge">
                      {race.distance || "Race"}
                    </span>
                  </div>
                  {raceDate && (
                    <span
                      style={{ fontSize: 13, color: "var(--lrc-text-muted)" }}
                    >
                      {format(raceDate, "MMM d, yyyy")}
                    </span>
                  )}
                </div>

                <h3 className="race-name">{race.name}</h3>

                <div className="race-meta">
                  {raceDate && (
                    <span>
                      <Calendar size={14} /> {format(raceDate, "EEEE, MMM d")}
                    </span>
                  )}
                  {race.location && (
                    <span>
                      <MapPin size={14} /> {race.location}
                    </span>
                  )}
                </div>

                {/* Participant avatars */}
                {participantCount > 0 && (
                  <div className="race-participants">
                    <div className="race-avatar-stack">
                      {race.participants.slice(0, 4).map((uid, i) => (
                        <div
                          key={uid}
                          className="member-avatar"
                          style={{
                            background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                          }}
                        >
                          🏃
                        </div>
                      ))}
                    </div>
                    <span className="race-participant-count">
                      {participantCount}{" "}
                      {participantCount === 1 ? "runner" : "runners"} from LRC
                    </span>
                  </div>
                )}

                <div className="race-bottom">
                  <button
                    className={`race-running-btn ${isRunning ? "race-active" : ""}`}
                    onClick={() => handleToggle(race.id)}
                    disabled={toggleLoading[race.id]}
                  >
                    <CheckCircle size={14} />
                    {isRunning ? "I'm running! ✓" : "I'm running this!"}
                  </button>

                  {race.url && (
                    <a
                      href={race.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="race-link"
                    >
                      Register <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
