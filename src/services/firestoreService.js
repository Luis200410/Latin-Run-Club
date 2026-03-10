import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

// ──────────────────────────────────────────────────────
// 🚧 DEV BYPASS: Must match the flag in AuthContext.jsx
//    When true, returns mock data instantly without Firestore.
// ──────────────────────────────────────────────────────
const DEV_BYPASS_AUTH = true;

// ─── Mock Data ───────────────────────────────────────────────

function mockTimestamp(daysFromNow = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return { toDate: () => d };
}

const MOCK_MEMBERS = [
  {
    id: "mock-1",
    firstName: "Maria",
    lastName: "Rodriguez",
    email: "maria@lrc.com",
    city: "new_york",
    photoURL: "",
    runsAttended: 24,
    totalDistanceKm: 198,
    joinedAt: mockTimestamp(-120),
  },
  {
    id: "mock-2",
    firstName: "Diego",
    lastName: "Santos",
    email: "diego@lrc.com",
    city: "new_york",
    photoURL: "",
    runsAttended: 18,
    totalDistanceKm: 142,
    joinedAt: mockTimestamp(-90),
  },
  {
    id: "mock-3",
    firstName: "Isabella",
    lastName: "Moreno",
    email: "isabella@lrc.com",
    city: "new_york",
    photoURL: "",
    runsAttended: 15,
    totalDistanceKm: 110,
    joinedAt: mockTimestamp(-60),
  },
  {
    id: "mock-4",
    firstName: "Alejandro",
    lastName: "Cruz",
    email: "alejandro@lrc.com",
    city: "new_york",
    photoURL: "",
    runsAttended: 9,
    totalDistanceKm: 67,
    joinedAt: mockTimestamp(-30),
  },
];

const MOCK_CITIES = [
  {
    id: "new_york",
    name: "New York",
    description:
      "Running through the five boroughs. From Central Park loops to Brooklyn Bridge sunrises — NYC runs different.",
  },
  {
    id: "washington_dc",
    name: "Washington DC",
    description:
      "Monuments, memorials, and miles. The DC chapter runs the capital with pride and purpose.",
  },
  {
    id: "boston",
    name: "Boston",
    description:
      "From the Esplanade to the Marathon route. Boston runners bring that New England grit every week.",
  },
  {
    id: "atlanta",
    name: "Atlanta",
    description:
      "Running through the heart of the South. ATL brings the heat, the culture, and the community.",
  },
  {
    id: "london",
    name: "London",
    description:
      "From Hyde Park to the Thames Path. Our international chapter proving LRC has no borders.",
  },
];

const MOCK_RUNS = [
  {
    id: "run-1",
    city: "new_york",
    location: "Central Park — 72nd St Entrance",
    date: mockTimestamp(3),
    time: "7:00 AM",
    paceGroup: "moderate",
    status: "upcoming",
    rsvps: ["dev-mock-user-001", "mock-1", "mock-2"],
  },
  {
    id: "run-2",
    city: "new_york",
    location: "Brooklyn Bridge Promenade",
    date: mockTimestamp(10),
    time: "6:30 AM",
    paceGroup: "easy",
    status: "upcoming",
    rsvps: ["mock-3"],
  },
];

const MOCK_PAST_RUNS = [
  {
    id: "past-run-1",
    city: "new_york",
    location: "Central Park 10K Loop",
    date: mockTimestamp(-5),
    time: "6:00 AM",
    paceGroup: "moderate",
    status: "completed",
    distanceKm: 10,
    rsvps: ["dev-mock-user-001", "mock-1", "mock-2"],
    attendees: ["dev-mock-user-001", "mock-1", "mock-2"],
  },
  {
    id: "past-run-2",
    city: "new_york",
    location: "Prospect Park Easy 5K",
    date: mockTimestamp(-12),
    time: "7:00 AM",
    paceGroup: "easy",
    status: "completed",
    distanceKm: 5,
    rsvps: ["dev-mock-user-001", "mock-3"],
    attendees: ["dev-mock-user-001", "mock-3"],
  },
  {
    id: "past-run-3",
    city: "new_york",
    location: "West Side Highway Long Run",
    date: mockTimestamp(-20),
    time: "6:30 AM",
    paceGroup: "fast",
    status: "completed",
    distanceKm: 15,
    rsvps: ["dev-mock-user-001"],
    attendees: ["dev-mock-user-001"],
  },
];

const MOCK_RACES = [
  {
    id: "race-1",
    name: "NYC Half Marathon",
    distance: "Half Marathon",
    city: "new_york",
    location: "Central Park, New York",
    date: mockTimestamp(45),
    url: "https://www.nyrr.org",
    participants: ["dev-mock-user-001", "mock-1", "mock-2"],
  },
  {
    id: "race-2",
    name: "Brooklyn 10K",
    distance: "10K",
    city: "new_york",
    location: "Prospect Park, Brooklyn",
    date: mockTimestamp(21),
    url: "https://www.nyrr.org",
    participants: ["mock-1"],
  },
  {
    id: "race-3",
    name: "Cherry Blossom 5K",
    distance: "5K",
    city: "washington_dc",
    location: "National Mall, Washington DC",
    date: mockTimestamp(30),
    url: "https://www.cherryblossom.org",
    participants: ["mock-3", "mock-4"],
  },
];

const MOCK_FEED = [
  {
    id: "feed-1",
    type: "new_member",
    message: "Alejandro Cruz joined the New York chapter! 🎉",
    city: "new_york",
    timestamp: mockTimestamp(-1),
  },
  {
    id: "feed-2",
    type: "run_completed",
    message: "Maria Rodriguez completed the Central Park 5K loop 🏃‍♀️",
    city: "new_york",
    timestamp: mockTimestamp(-2),
  },
  {
    id: "feed-3",
    type: "race_signup",
    message: "Diego Santos signed up for the NYC Half Marathon 🏅",
    city: "new_york",
    timestamp: mockTimestamp(-3),
  },
  {
    id: "feed-4",
    type: "run_completed",
    message: "Isabella Moreno logged 8.2 KM on the Brooklyn Bridge route 💪",
    city: "new_york",
    timestamp: mockTimestamp(-4),
  },
];

// ─── User Profiles ───────────────────────────────────────────

export async function getUserProfile(uid) {
  if (DEV_BYPASS_AUTH) return MOCK_MEMBERS.find((m) => m.id === uid) || null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createUserProfile(uid, data) {
  if (DEV_BYPASS_AUTH) return;
  await setDoc(doc(db, "users", uid), {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    city: data.city || "new_york",
    photoURL: data.photoURL || "",
    joinedAt: serverTimestamp(),
    stravaConnected: false,
    stravaAthleteId: null,
    runsAttended: 0,
    totalDistanceKm: 0,
  });
}

export async function updateUserProfile(uid, data) {
  if (DEV_BYPASS_AUTH) return;
  await updateDoc(doc(db, "users", uid), data);
}

// ─── Cities ──────────────────────────────────────────────────

export async function getAllCities() {
  if (DEV_BYPASS_AUTH) return MOCK_CITIES;
  const snap = await getDocs(collection(db, "cities"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getCityInfo(cityId) {
  if (DEV_BYPASS_AUTH) return MOCK_CITIES.find((c) => c.id === cityId) || null;
  const snap = await getDoc(doc(db, "cities", cityId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ─── City Members ────────────────────────────────────────────

export async function getCityMembers(cityId) {
  if (DEV_BYPASS_AUTH) return MOCK_MEMBERS;
  const q = query(
    collection(db, "users"),
    where("city", "==", cityId),
    orderBy("joinedAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Runs ────────────────────────────────────────────────────

export function subscribeToCityRuns(cityId, callback) {
  if (DEV_BYPASS_AUTH) {
    const cityRuns = MOCK_RUNS.filter((r) => r.city === cityId);
    setTimeout(() => callback(cityRuns), 0);
    return () => {}; // noop unsubscribe
  }
  const q = query(
    collection(db, "runs"),
    where("city", "==", cityId),
    where("status", "==", "upcoming"),
    orderBy("date", "asc"),
  );
  return onSnapshot(q, (snap) => {
    const runs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(runs);
  });
}

export async function getNextRun(cityId) {
  if (DEV_BYPASS_AUTH) {
    return MOCK_RUNS.find((r) => r.city === cityId) || null;
  }
  const now = Timestamp.now();
  const q = query(
    collection(db, "runs"),
    where("city", "==", cityId),
    where("status", "==", "upcoming"),
    where("date", ">=", now),
    orderBy("date", "asc"),
    limit(1),
  );
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function toggleRunRSVP(runId, uid) {
  if (DEV_BYPASS_AUTH) {
    const run = MOCK_RUNS.find((r) => r.id === runId);
    if (!run) return true;
    if (!run.rsvps) run.rsvps = [];
    if (run.rsvps.includes(uid)) {
      run.rsvps = run.rsvps.filter((id) => id !== uid);
      return false;
    } else {
      run.rsvps.push(uid);
      return true;
    }
  }
  const ref = doc(db, "runs", runId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const rsvps = snap.data().rsvps || [];
  if (rsvps.includes(uid)) {
    await updateDoc(ref, { rsvps: arrayRemove(uid) });
    return false; // removed
  } else {
    await updateDoc(ref, { rsvps: arrayUnion(uid) });
    return true; // added
  }
}

export async function getPastUserRuns(uid) {
  if (DEV_BYPASS_AUTH) {
    return MOCK_PAST_RUNS.filter(
      (run) => run.attendees && run.attendees.includes(uid),
    );
  }
  const runsRef = collection(db, "runs");
  const q = query(
    runsRef,
    where("status", "==", "completed"),
    where("attendees", "array-contains", uid),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Races ───────────────────────────────────────────────────

export async function getRaces(filters = {}) {
  if (DEV_BYPASS_AUTH) {
    return MOCK_RACES.filter((r) => {
      if (filters.city && r.city !== filters.city) return false;
      if (filters.distance && r.distance !== filters.distance) return false;
      return true;
    });
  }
  let q = collection(db, "races");
  const constraints = [orderBy("date", "asc")];

  if (filters.city) {
    constraints.unshift(where("city", "==", filters.city));
  }
  if (filters.distance) {
    constraints.unshift(where("distance", "==", filters.distance));
  }

  q = query(q, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function toggleRaceParticipation(raceId, uid) {
  if (DEV_BYPASS_AUTH) {
    const race = MOCK_RACES.find((r) => r.id === raceId);
    if (!race) return true;
    if (!race.participants) race.participants = [];
    if (race.participants.includes(uid)) {
      race.participants = race.participants.filter((id) => id !== uid);
      return false;
    } else {
      race.participants.push(uid);
      return true;
    }
  }
  const ref = doc(db, "races", raceId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const participants = snap.data().participants || [];
  if (participants.includes(uid)) {
    await updateDoc(ref, { participants: arrayRemove(uid) });
    return false;
  } else {
    await updateDoc(ref, { participants: arrayUnion(uid) });
    return true;
  }
}

// ─── Activity Feed ───────────────────────────────────────────

export function subscribeToActivityFeed(cityId, callback, feedLimit = 15) {
  if (DEV_BYPASS_AUTH) {
    const cityFeed = MOCK_FEED.filter((f) => f.city === cityId).slice(
      0,
      feedLimit,
    );
    setTimeout(() => callback(cityFeed), 0);
    return () => {}; // noop unsubscribe
  }
  const q = query(
    collection(db, "activity_feed"),
    where("city", "==", cityId),
    orderBy("timestamp", "desc"),
    limit(feedLimit),
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}
