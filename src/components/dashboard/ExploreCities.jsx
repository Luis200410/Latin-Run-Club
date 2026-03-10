import { useState, useEffect } from "react";
import {
  getAllCities,
  getCityMembers,
  getNextRun,
} from "../../services/firestoreService";
import { Globe, Users, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

const CITY_GRADIENTS = {
  new_york: "linear-gradient(135deg, #1a1a2e, #16213e)",
  washington_dc: "linear-gradient(135deg, rgb(66, 78, 52), rgb(90, 110, 70))",
  boston: "linear-gradient(135deg, rgb(0, 151, 178), rgb(0, 110, 140))",
  atlanta: "linear-gradient(135deg, rgb(213, 45, 93), rgb(180, 30, 70))",
  london: "linear-gradient(135deg, rgb(140, 119, 171), rgb(100, 80, 140))",
};

const CITY_DESCRIPTIONS = {
  new_york:
    "Running through the five boroughs. From Central Park loops to Brooklyn Bridge sunrises — NYC runs different.",
  washington_dc:
    "Monuments, memorials, and miles. The DC chapter runs the capital with pride and purpose.",
  boston:
    "From the Esplanade to the Marathon route. Boston runners bring that New England grit every week.",
  atlanta:
    "Running through the heart of the South. ATL brings the heat, the culture, and the community.",
  london:
    "From Hyde Park to the Thames Path. Our international chapter proving LRC has no borders.",
};

const CITY_NAMES = {
  new_york: "New York",
  washington_dc: "Washington DC",
  boston: "Boston",
  atlanta: "Atlanta",
  london: "London",
};

export default function ExploreCities() {
  const [cities, setCities] = useState([]);
  const [cityData, setCityData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allCities = await getAllCities();

        // If no cities in Firestore yet, use default list
        const cityList =
          allCities.length > 0
            ? allCities
            : Object.keys(CITY_NAMES).map((id) => ({
                id,
                name: CITY_NAMES[id],
              }));

        setCities(cityList);

        // Fetch additional data for each city
        const dataPromises = cityList.map(async (c) => {
          try {
            const [members, nextRun] = await Promise.all([
              getCityMembers(c.id),
              getNextRun(c.id),
            ]);
            return { id: c.id, memberCount: members.length, nextRun };
          } catch {
            return { id: c.id, memberCount: 0, nextRun: null };
          }
        });

        const results = await Promise.all(dataPromises);
        const dataMap = {};
        results.forEach((r) => {
          dataMap[r.id] = r;
        });
        setCityData(dataMap);
      } catch (err) {
        console.error("Explore cities load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="skeleton skeleton-title" style={{ width: "40%" }}></div>
        <div className="city-grid" style={{ marginTop: 20 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              className="skeleton skeleton-card"
              key={i}
              style={{ height: 260 }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">
        <Globe
          size={24}
          style={{
            display: "inline",
            verticalAlign: "middle",
            marginRight: 8,
            color: "var(--lrc-teal)",
          }}
        />
        Explore Cities
      </h1>
      <p className="page-subtitle">
        Browse all Latin Run Club chapters around the world. One community, many
        cities.
      </p>

      <div className="city-grid">
        {cities.map((city) => {
          const data = cityData[city.id] || {};
          const nextRun = data.nextRun;
          const gradient = CITY_GRADIENTS[city.id] || CITY_GRADIENTS.new_york;
          const description =
            city.description || CITY_DESCRIPTIONS[city.id] || "";

          return (
            <div className="city-explore-card" key={city.id}>
              <div
                className="city-explore-banner"
                style={{ background: gradient }}
              >
                <h3>{city.name || CITY_NAMES[city.id]}</h3>
              </div>
              <div className="city-explore-body">
                <p className="city-explore-description">{description}</p>

                <div className="city-explore-stats">
                  <div className="city-explore-stat">
                    <div className="city-explore-stat-value">
                      {data.memberCount || 0}
                    </div>
                    <div className="city-explore-stat-label">Members</div>
                  </div>
                  {nextRun && (
                    <div className="city-explore-stat">
                      <div className="city-explore-stat-value">
                        {nextRun.date?.toDate
                          ? format(nextRun.date.toDate(), "MMM d")
                          : "—"}
                      </div>
                      <div className="city-explore-stat-label">Next Run</div>
                    </div>
                  )}
                </div>

                {nextRun ? (
                  <div className="city-explore-next-run">
                    <Calendar size={14} />
                    {nextRun.location || "Group Run"} • {nextRun.time || "TBD"}
                  </div>
                ) : (
                  <div
                    className="city-explore-next-run"
                    style={{ color: "var(--lrc-text-muted)" }}
                  >
                    <Calendar size={14} />
                    No upcoming runs
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
