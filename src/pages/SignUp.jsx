import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/refined-auth.css";
import "../style/refined-auth.css";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const RUNNING_LEVELS = [
  { value: 0, label: "Novice", color: "#22d3ee" },
  { value: 25, label: "Casual", color: "#facc15" },
  { value: 50, label: "Active", color: "#fb923c" },
  { value: 75, label: "Advanced", color: "#a855f7" },
  { value: 100, label: "Elite", color: "#ec4899" },
];

function mapLocationToCity(location) {
  const loc = (location || "").toLowerCase();
  if (loc.includes("new york") || loc.includes("nyc") || loc.includes("ny"))
    return "new_york";
  if (loc.includes("washington") || loc.includes("dc") || loc.includes("d.c."))
    return "washington_dc";
  if (loc.includes("boston")) return "boston";
  if (loc.includes("atlanta") || loc.includes("atl")) return "atlanta";
  if (loc.includes("london")) return "london";
  return "new_york"; // default
}

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    levelValue: 50, // Slider value 0-100
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup, googleSignIn } = useAuth();
  const { t } = useLanguage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, levelValue: Number(e.target.value) });
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await googleSignIn();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign up with Google: " + err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signup(
        formData.email,
        password,
        formData.name,
        mapLocationToCity(formData.location),
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed: " + err.message);
    }
    setLoading(false);
  };

  // Find closest level for styling
  const getActiveLevelIndex = (val) => {
    if (val < 12.5) return 0;
    if (val < 37.5) return 1;
    if (val < 62.5) return 2;
    if (val < 87.5) return 3;
    return 4;
  };
  const activeIndex = getActiveLevelIndex(formData.levelValue);

  return (
    <div className="auth-page-container">
      {/* SIDEBAR */}
      <aside className="auth-sidebar">
        <div className="auth-brand-tag">LATIN RUN CLUB</div>
        <div className="sidebar-content">
          <h1 className="hero-title">{t("join_the")}</h1>
        </div>
        <div className="hero-footer">{t("velocity_culture_community")}</div>
      </aside>

      {/* FORM AREA */}
      <main className="auth-form-container">
        <header className="form-header">
          <span className="subtitle">{t("athlete_profile")}</span>
          <h2 className="main-title">
            {t("define_your_pace")}
            <br />
            {t("claim_your_spot")}
          </h2>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("full_name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("enter_full_name")}
              required
            />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>{t("email_address")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("email_placeholder")}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("location_city")}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t("location_placeholder")}
              />
            </div>
          </div>

          {/* Hidden Password for functional Auth */}
          <div
            className="form-group"
            style={{ display: password ? "flex" : "none" }}
          >
            {/* We hide it or show it depending on user flow, but for now lets keep it visible or add it as a required field that looks like the others if user forgot */}
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {/* Add password field properly since it's required for firebase */}
          <div className="form-group">
            <label>{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* SLIDER */}
          <div className="level-selector">
            <div className="level-header">
              <span className="level-title">{t("running_level")}</span>
              <span className="pro-badge">{t("pro_status")}</span>
            </div>

            <div className="slider-wrapper">
              {/* Visual Track */}
              <div className="visual-track">
                {/* Thumb */}
                <div
                  className="visual-thumb"
                  style={{ left: `${formData.levelValue}%` }}
                ></div>
              </div>

              {/* Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={formData.levelValue}
                onChange={handleSliderChange}
                className="real-slider"
              />

              {/* Labels */}
              <div className="slider-labels">
                {RUNNING_LEVELS.map((lvl, index) => (
                  <div
                    key={lvl.value}
                    className={`slider-label-item ${index === activeIndex ? "active" : ""}`}
                    style={{ flex: 1 }}
                  >
                    <div
                      className="slider-dot"
                      style={{ backgroundColor: lvl.color }}
                    ></div>
                    <span className="slider-text">{lvl.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {t("create_profile")} <span style={{ marginLeft: "10px" }}>→</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="google-btn"
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            {t("sign_in_google")}
          </button>

          <p className="legal-text">{t("legal_text")}</p>
        </form>
      </main>
    </div>
  );
}
