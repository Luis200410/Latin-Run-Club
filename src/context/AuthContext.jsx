import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile as updateProfileInDB,
} from "../services/firestoreService";

// ──────────────────────────────────────────────────────
// 🚧 DEV BYPASS: Set to true to skip Firebase auth
//    and use mock user data for viewing dashboard pages.
//    Set back to false when ready to use real auth.
// ──────────────────────────────────────────────────────
const DEV_BYPASS_AUTH = false;

const MOCK_USER = {
  uid: "dev-mock-user-001",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "",
};

const MOCK_PROFILE = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  city: "new_york",
  photoURL: "",
  runsAttended: 12,
  totalDistanceKm: 87,
  totalPoints: 20,
  isAdmin: true,
  stravaConnected: false,
  joinedAt: { toDate: () => new Date("2025-06-15") },
};

// Derive first/last name from a full-name string, falling back to the
// email's local part when no name is available (e.g. Google accounts that
// don't share a display name). Guarantees a non-empty firstName so users
// never get scanned as a nameless "User xxxx".
function deriveNames(fullName, email) {
  const cleaned = (fullName || "").trim();
  if (cleaned) {
    const parts = cleaned.split(/\s+/);
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  }
  const localPart = (email || "").split("@")[0] || "";
  const token = localPart.split(/[._-]+/)[0] || "";
  const firstName = token
    ? token.charAt(0).toUpperCase() + token.slice(1)
    : "Runner";
  return { firstName, lastName: "" };
}

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    DEV_BYPASS_AUTH ? MOCK_USER : null,
  );
  const [userProfile, setUserProfile] = useState(
    DEV_BYPASS_AUTH ? MOCK_PROFILE : null,
  );
  const [loading, setLoading] = useState(DEV_BYPASS_AUTH ? false : true);

  // Set while signup/googleSignIn is creating the profile itself, so the
  // onAuthStateChanged self-heal below doesn't race and overwrite the real
  // name/city with a fallback.
  const creatingProfileRef = useRef(false);

  async function signup(email, password, name, city, runningLevel) {
    if (DEV_BYPASS_AUTH) return { user: MOCK_USER };

    creatingProfileRef.current = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: name });

      // Create Firestore profile
      const { firstName, lastName } = deriveNames(name, email);

      await createUserProfile(userCredential.user.uid, {
        firstName,
        lastName,
        email,
        city: city || "new_york",
        photoURL: "",
        runningLevel: runningLevel || 50,
      });

      // Fetch the profile we just created
      const profile = await getUserProfile(userCredential.user.uid);
      setUserProfile(profile);

      return userCredential;
    } finally {
      creatingProfileRef.current = false;
    }
  }

  function login(email, password) {
    if (DEV_BYPASS_AUTH) return Promise.resolve({ user: MOCK_USER });
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (DEV_BYPASS_AUTH) {
      console.log("[DEV] Logout bypassed in dev mode");
      setCurrentUser(null);
      setUserProfile(null);
      return Promise.resolve();
    }
    setUserProfile(null);
    return signOut(auth);
  }

  async function googleSignIn(city, runningLevel) {
    if (DEV_BYPASS_AUTH) return { user: MOCK_USER };

    const provider = new GoogleAuthProvider();
    creatingProfileRef.current = true;
    try {
      const result = await signInWithPopup(auth, provider);
      const { firstName, lastName } = deriveNames(
        result.user.displayName,
        result.user.email,
      );

      // Check if Firestore profile exists; if not, create one. If it exists
      // but has a blank name (older Google accounts), repair it.
      let profile = await getUserProfile(result.user.uid);
      if (!profile) {
        await createUserProfile(result.user.uid, {
          firstName,
          lastName,
          email: result.user.email || "",
          city: city || "new_york",
          photoURL: result.user.photoURL || "",
          runningLevel: runningLevel !== undefined ? runningLevel : 50,
        });
        profile = await getUserProfile(result.user.uid);
      } else if (!profile.firstName) {
        await updateProfileInDB(result.user.uid, { firstName, lastName });
        profile = { ...profile, firstName, lastName };
      }
      setUserProfile(profile);
      return result;
    } finally {
      creatingProfileRef.current = false;
    }
  }

  async function updateUserProfile(data) {
    if (DEV_BYPASS_AUTH) {
      // In dev mode, just update state locally
      setUserProfile((prev) => ({ ...prev, ...data }));
      console.log("[DEV] Profile updated locally:", data);
      return;
    }
    if (!currentUser) return;
    await updateProfileInDB(currentUser.uid, data);
    const updated = await getUserProfile(currentUser.uid);
    setUserProfile(updated);
  }

  // Best-effort profile repair. Runs in the background (never awaited by the
  // auth listener) so a slow/offline Firestore write can't block login. It only
  // creates a profile when one is genuinely missing, and otherwise patches just
  // the name — it never touches isAdmin, points, or other existing fields.
  async function healUserProfile(user) {
    const profile = await getUserProfile(user.uid);
    const { firstName, lastName } = deriveNames(user.displayName, user.email);
    if (!profile) {
      await createUserProfile(user.uid, {
        firstName,
        lastName,
        email: user.email || "",
        photoURL: user.photoURL || "",
      });
    } else if (!profile.firstName) {
      await updateProfileInDB(user.uid, { firstName, lastName });
    } else {
      return; // nothing to repair
    }
    const updated = await getUserProfile(user.uid);
    setUserProfile(updated);
  }

  useEffect(() => {
    if (DEV_BYPASS_AUTH) {
      console.log(
        "🚧 [DEV] Auth bypass active — using mock user data. Set DEV_BYPASS_AUTH = false in AuthContext.jsx to disable.",
      );
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      // Read the profile and render the app immediately. Repair (if any) is
      // kicked off in the background below so it can NEVER block login or the
      // loading state — a slow/offline Firestore write used to hang here and
      // freeze the app on the loading screen.
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }

      // Self-heal a missing/blank-name profile in the background. Skipped while
      // signup/googleSignIn is already creating it, to avoid a write race.
      if (!creatingProfileRef.current) {
        healUserProfile(user).catch((err) =>
          console.error("Profile self-heal skipped:", err),
        );
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    isAdmin: userProfile?.isAdmin === true,
    signup,
    login,
    logout,
    googleSignIn,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
