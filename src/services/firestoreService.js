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
  deleteField,
  increment,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

// ──────────────────────────────────────────────────────
// 🚧 DEV BYPASS: Must match the flag in AuthContext.jsx
//    When true, returns mock data instantly without Firestore.
// ──────────────────────────────────────────────────────
const DEV_BYPASS_AUTH = false;

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
    totalPoints: 10,
    isAdmin: false,
    joinedAt: mockTimestamp(-120),
  },
  {
    id: "mock-2",
    firstName: "Diego",
    lastName: "Santos",
    email: "diego@lrc.com",
    city: "boston",
    photoURL: "",
    runsAttended: 18,
    totalDistanceKm: 142,
    totalPoints: 25,
    isAdmin: false,
    joinedAt: mockTimestamp(-90),
  },
  {
    id: "mock-3",
    firstName: "Isabella",
    lastName: "Moreno",
    email: "isabella@lrc.com",
    city: "washington_dc",
    photoURL: "",
    runsAttended: 15,
    totalDistanceKm: 110,
    totalPoints: 15,
    isAdmin: false,
    joinedAt: mockTimestamp(-60),
  },
  {
    id: "mock-4",
    firstName: "Alejandro",
    lastName: "Cruz",
    email: "alejandro@lrc.com",
    city: "washington_dc",
    photoURL: "",
    runsAttended: 9,
    totalDistanceKm: 67,
    totalPoints: 5,
    isAdmin: false,
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
    participantCities: {
      "dev-mock-user-001": "new_york",
      "mock-1": "new_york",
      "mock-2": "boston",
    },
    confirmedAttendees: ["mock-1"],
    pointValue: 10,
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
    participantCities: { "mock-1": "new_york" },
    confirmedAttendees: [],
    pointValue: 5,
  },
  {
    id: "race-3",
    name: "Cherry Blossom 5K",
    distance: "5K",
    city: "washington_dc",
    location: "National Mall, Washington DC",
    date: mockTimestamp(30),
    url: "https://www.cherryblossom.org",
    participants: ["mock-3", "mock-4", "dev-mock-user-001"],
    participantCities: {
      "mock-3": "washington_dc",
      "mock-4": "washington_dc",
      "dev-mock-user-001": "new_york",
    },
    confirmedAttendees: [],
    pointValue: 5,
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

// Mock user entry for leaderboard (matches MOCK_PROFILE in AuthContext)
const MOCK_CURRENT_USER_ENTRY = {
  id: "dev-mock-user-001",
  firstName: "Test",
  lastName: "User",
  city: "new_york",
  photoURL: "",
  totalPoints: 20,
  isAdmin: true,
};

// ─── User Profiles ───────────────────────────────────────────

export async function getUserProfile(uid) {
  if (DEV_BYPASS_AUTH) return MOCK_MEMBERS.find((m) => m.id === uid) || null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createUserProfile(uid, data) {
  if (DEV_BYPASS_AUTH) return;
  await setDoc(
    doc(db, "users", uid),
    {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      city: data.city || "new_york",
      photoURL: data.photoURL || "",
      runningLevel: data.runningLevel || 50,
      joinedAt: serverTimestamp(),
      stravaConnected: false,
      stravaAthleteId: null,
      runsAttended: 0,
      totalDistanceKm: 0,
      totalPoints: 0,
      isAdmin: false,
    },
    { merge: true },
  );
}

export async function updateUserProfile(uid, data) {
  if (DEV_BYPASS_AUTH) return;
  await updateDoc(doc(db, "users", uid), data);
}

export async function disconnectStrava(uid) {
  if (DEV_BYPASS_AUTH) return;
  await updateDoc(doc(db, "users", uid), {
    stravaConnected: false,
    stravaAthleteId: null,
    stravaAccessToken: null,
    stravaRefreshToken: null,
    stravaTokenExpiresAt: null,
    stravaActivities: 0,
    stravaTotalKm: 0,
    stravaAvgPace: "—",
  });
}

export async function isUserAdmin(uid) {
  if (DEV_BYPASS_AUTH) return true;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().isAdmin === true : false;
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
  if (DEV_BYPASS_AUTH) return MOCK_MEMBERS.filter((m) => m.city === cityId);
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
    return () => {};
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
    return false;
  } else {
    await updateDoc(ref, { rsvps: arrayUnion(uid) });
    return true;
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

export async function getRace(raceId) {
  if (DEV_BYPASS_AUTH) return MOCK_RACES.find((r) => r.id === raceId) || null;
  const snap = await getDoc(doc(db, "races", raceId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getRaceWithParticipantDetails(raceId) {
  if (DEV_BYPASS_AUTH) {
    const race = MOCK_RACES.find((r) => r.id === raceId);
    if (!race) return null;
    const allUsers = [...MOCK_MEMBERS, MOCK_CURRENT_USER_ENTRY];
    const participantDetails = (race.participants || []).map((uid) => {
      const user = allUsers.find((m) => m.id === uid);
      return user
        ? { uid, ...user, homeCity: race.participantCities?.[uid] || user.city }
        : { uid, firstName: "Unknown", lastName: "", homeCity: "unknown" };
    });
    return { ...race, participantDetails };
  }
  const raceSnap = await getDoc(doc(db, "races", raceId));
  if (!raceSnap.exists()) return null;
  const raceData = { id: raceSnap.id, ...raceSnap.data() };

  const participants = raceData.participants || [];
  const participantCities = raceData.participantCities || {};

  const profiles = await Promise.all(
    participants.map(async (uid) => {
      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists())
        return { uid, firstName: "Unknown", lastName: "", homeCity: "unknown" };
      return {
        uid,
        ...snap.data(),
        homeCity: participantCities[uid] || snap.data().city,
      };
    }),
  );

  return { ...raceData, participantDetails: profiles };
}

export async function toggleRaceParticipation(raceId, uid, homeCity) {
  if (DEV_BYPASS_AUTH) {
    const race = MOCK_RACES.find((r) => r.id === raceId);
    if (!race) return true;
    if (!race.participants) race.participants = [];
    if (!race.participantCities) race.participantCities = {};
    if (race.participants.includes(uid)) {
      race.participants = race.participants.filter((id) => id !== uid);
      delete race.participantCities[uid];
      return false;
    } else {
      race.participants.push(uid);
      if (homeCity) race.participantCities[uid] = homeCity;
      return true;
    }
  }
  const ref = doc(db, "races", raceId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const participants = snap.data().participants || [];
  if (participants.includes(uid)) {
    const update = {
      participants: arrayRemove(uid),
      [`participantCities.${uid}`]: deleteField(),
    };
    await updateDoc(ref, update);
    return false;
  } else {
    const update = { participants: arrayUnion(uid) };
    if (homeCity) update[`participantCities.${uid}`] = homeCity;
    await updateDoc(ref, update);
    return true;
  }
}

export async function confirmRaceAttendance(raceId, uid) {
  if (DEV_BYPASS_AUTH) {
    const race = MOCK_RACES.find((r) => r.id === raceId);
    if (!race) return;
    if (!race.confirmedAttendees) race.confirmedAttendees = [];
    if (!race.confirmedAttendees.includes(uid)) {
      race.confirmedAttendees.push(uid);
      const member = MOCK_MEMBERS.find((m) => m.id === uid);
      if (member)
        member.totalPoints = (member.totalPoints || 0) + (race.pointValue || 0);
      if (uid === MOCK_CURRENT_USER_ENTRY.id)
        MOCK_CURRENT_USER_ENTRY.totalPoints =
          (MOCK_CURRENT_USER_ENTRY.totalPoints || 0) + (race.pointValue || 0);
    }
    return;
  }
  const raceRef = doc(db, "races", raceId);
  const raceSnap = await getDoc(raceRef);
  if (!raceSnap.exists()) return;

  const raceData = raceSnap.data();
  if ((raceData.confirmedAttendees || []).includes(uid)) return;

  const pointValue = raceData.pointValue || 0;
  await updateDoc(raceRef, { confirmedAttendees: arrayUnion(uid) });
  if (pointValue > 0) {
    await updateDoc(doc(db, "users", uid), {
      totalPoints: increment(pointValue),
    });
  }
}

export async function updateRacePointValue(raceId, pointValue) {
  if (DEV_BYPASS_AUTH) {
    const race = MOCK_RACES.find((r) => r.id === raceId);
    if (race) race.pointValue = pointValue;
    return;
  }
  await updateDoc(doc(db, "races", raceId), { pointValue });
}

export async function createRace(data) {
  if (DEV_BYPASS_AUTH) {
    const newRace = {
      id: `race-${Date.now()}`,
      ...data,
      participants: [],
      participantCities: {},
      confirmedAttendees: [],
    };
    MOCK_RACES.push(newRace);
    return newRace.id;
  }
  const ref = await addDoc(collection(db, "races"), {
    ...data,
    participants: [],
    participantCities: {},
    confirmedAttendees: [],
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRace(raceId, data) {
  if (DEV_BYPASS_AUTH) {
    const idx = MOCK_RACES.findIndex((r) => r.id === raceId);
    if (idx >= 0) MOCK_RACES[idx] = { ...MOCK_RACES[idx], ...data };
    return;
  }
  await updateDoc(doc(db, "races", raceId), data);
}

export async function deleteRace(raceId) {
  if (DEV_BYPASS_AUTH) {
    const idx = MOCK_RACES.findIndex((r) => r.id === raceId);
    if (idx >= 0) MOCK_RACES.splice(idx, 1);
    return;
  }
  await deleteDoc(doc(db, "races", raceId));
}

export function subscribeToRaceConfirmedAttendees(raceId, callback) {
  if (DEV_BYPASS_AUTH) {
    const race = MOCK_RACES.find((r) => r.id === raceId);
    if (!race) {
      setTimeout(() => callback([]), 0);
      return () => {};
    }
    const allUsers = [...MOCK_MEMBERS, MOCK_CURRENT_USER_ENTRY];
    const attendees = (race.confirmedAttendees || []).map((uid) => {
      const user = allUsers.find((m) => m.id === uid);
      return user || { id: uid, firstName: "Unknown", lastName: "" };
    });
    setTimeout(() => callback(attendees), 0);
    return () => {};
  }
  return onSnapshot(doc(db, "races", raceId), async (snap) => {
    if (!snap.exists()) {
      callback([]);
      return;
    }
    const confirmedUids = snap.data().confirmedAttendees || [];
    const profiles = await Promise.all(
      confirmedUids.map(async (uid) => {
        const userSnap = await getDoc(doc(db, "users", uid));
        return userSnap.exists()
          ? { id: uid, ...userSnap.data() }
          : { id: uid, firstName: "Unknown", lastName: "" };
      }),
    );
    callback(profiles);
  });
}

// ─── Leaderboard ─────────────────────────────────────────────

export async function getLeaderboard(cityId) {
  if (DEV_BYPASS_AUTH) {
    const allMembers = [...MOCK_MEMBERS, MOCK_CURRENT_USER_ENTRY];
    return allMembers
      .filter((m) => !cityId || m.city === cityId)
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      .slice(0, 50);
  }
  const constraints = [orderBy("totalPoints", "desc"), limit(50)];
  if (cityId) constraints.unshift(where("city", "==", cityId));
  const q = query(collection(db, "users"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Activity Feed ───────────────────────────────────────────

export function subscribeToActivityFeed(cityId, callback, feedLimit = 15) {
  if (DEV_BYPASS_AUTH) {
    const cityFeed = MOCK_FEED.filter((f) => f.city === cityId).slice(
      0,
      feedLimit,
    );
    setTimeout(() => callback(cityFeed), 0);
    return () => {};
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

// ─── Admin User Management ───────────────────────────────────

export async function getAllUsers() {
  if (DEV_BYPASS_AUTH) {
    return [...MOCK_MEMBERS, MOCK_CURRENT_USER_ENTRY];
  }
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateUserAdminStatus(uid, isAdmin) {
  if (DEV_BYPASS_AUTH) {
    const user =
      uid === MOCK_CURRENT_USER_ENTRY.id
        ? MOCK_CURRENT_USER_ENTRY
        : MOCK_MEMBERS.find((m) => m.id === uid);
    if (user) {
      user.isAdmin = isAdmin;
    }
    return;
  }
  await updateDoc(doc(db, "users", uid), { isAdmin });
}
