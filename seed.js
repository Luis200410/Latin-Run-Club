// Run with: node seed.js
// Populates the Firebase project with a full demo dataset:
//   - 1 admin test account + 8 community members
//   - 3 upcoming races with participants from different cities
//   - 4 past completed runs
//   - Activity feed entries
// ─────────────────────────────────────────────────────────────
// Login after seeding:
//   Email:    demo@latinrunclub.com
//   Password: LRC_Demo_2025!

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const DEMO_EMAIL = "demo@latinrunclub.com";
const DEMO_PASSWORD = "LRC_Demo_2025!";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return Timestamp.fromDate(d);
}

// ─── Fake member IDs (not real Firebase Auth users — stored in Firestore only for display) ───
const MEMBER_IDS = {
  maria:     "demo-member-001",
  diego:     "demo-member-002",
  isabella:  "demo-member-003",
  alejandro: "demo-member-004",
  sofia:     "demo-member-005",
  miguel:    "demo-member-006",
  valentina: "demo-member-007",
  lucas:     "demo-member-008",
};

const MEMBERS = [
  { id: MEMBER_IDS.maria,     firstName: "Maria",     lastName: "Rodriguez", city: "new_york",      runsAttended: 24, totalDistanceKm: 198, totalPoints: 48, isAdmin: false },
  { id: MEMBER_IDS.diego,     firstName: "Diego",     lastName: "Santos",    city: "boston",        runsAttended: 18, totalDistanceKm: 142, totalPoints: 36, isAdmin: false },
  { id: MEMBER_IDS.isabella,  firstName: "Isabella",  lastName: "Moreno",    city: "washington_dc", runsAttended: 15, totalDistanceKm: 110, totalPoints: 30, isAdmin: false },
  { id: MEMBER_IDS.alejandro, firstName: "Alejandro", lastName: "Cruz",      city: "washington_dc", runsAttended: 9,  totalDistanceKm: 67,  totalPoints: 18, isAdmin: false },
  { id: MEMBER_IDS.sofia,     firstName: "Sofia",     lastName: "Vargas",    city: "new_york",      runsAttended: 21, totalDistanceKm: 175, totalPoints: 42, isAdmin: false },
  { id: MEMBER_IDS.miguel,    firstName: "Miguel",    lastName: "Perez",     city: "atlanta",       runsAttended: 12, totalDistanceKm: 88,  totalPoints: 24, isAdmin: false },
  { id: MEMBER_IDS.valentina, firstName: "Valentina", lastName: "Lima",      city: "london",        runsAttended: 7,  totalDistanceKm: 52,  totalPoints: 14, isAdmin: false },
  { id: MEMBER_IDS.lucas,     firstName: "Lucas",     lastName: "Fernandez", city: "boston",        runsAttended: 16, totalDistanceKm: 130, totalPoints: 32, isAdmin: false },
];

async function seed() {
  // ─── 1. Create / sign in demo admin account ───────────────
  let adminUid;
  try {
    const cred = await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
    adminUid = cred.user.uid;
    console.log("✅ Created demo admin user:", adminUid);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      const cred = await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
      adminUid = cred.user.uid;
      console.log("ℹ️  Demo user already exists, refreshing data:", adminUid);
    } else {
      throw err;
    }
  }

  // ─── 2. Write admin profile ────────────────────────────────
  await setDoc(doc(db, "users", adminUid), {
    firstName: "Carlos",
    lastName: "Demo",
    email: DEMO_EMAIL,
    city: "new_york",
    photoURL: "",
    joinedAt: Timestamp.fromDate(new Date("2024-09-01")),
    isAdmin: true,
    runsAttended: 19,
    totalDistanceKm: 158,
    totalPoints: 55,
    stravaConnected: false,
    stravaAthleteId: null,
    stravaAccessToken: null,
    stravaRefreshToken: null,
    stravaTokenExpiresAt: null,
    stravaActivities: 0,
    stravaTotalKm: 0,
    stravaAvgPace: "—",
  });
  console.log("✅ Admin profile written");

  // ─── 3. Write community member profiles ───────────────────
  const batch = writeBatch(db);
  for (const m of MEMBERS) {
    batch.set(doc(db, "users", m.id), {
      firstName: m.firstName,
      lastName: m.lastName,
      email: `${m.firstName.toLowerCase()}@demo.lrc`,
      city: m.city,
      photoURL: "",
      joinedAt: Timestamp.fromDate(new Date("2024-10-01")),
      isAdmin: m.isAdmin,
      runsAttended: m.runsAttended,
      totalDistanceKm: m.totalDistanceKm,
      totalPoints: m.totalPoints,
      stravaConnected: false,
      stravaAthleteId: null,
    });
  }
  await batch.commit();
  console.log(`✅ ${MEMBERS.length} community member profiles written`);

  // ─── 4. Upcoming races ─────────────────────────────────────
  const racesRef = collection(db, "races");

  const race1Ref = await addDoc(racesRef, {
    name: "NYC Half Marathon",
    distance: "Half Marathon",
    city: "new_york",
    location: "Central Park, New York",
    date: daysFromNow(30),
    url: "https://www.nyrr.org",
    participants: [adminUid, MEMBER_IDS.maria, MEMBER_IDS.sofia, MEMBER_IDS.diego],
    participantCities: {
      [adminUid]:       "new_york",
      [MEMBER_IDS.maria]:  "new_york",
      [MEMBER_IDS.sofia]:  "new_york",
      [MEMBER_IDS.diego]:  "boston",   // visiting from Boston
    },
    confirmedAttendees: [MEMBER_IDS.maria],
    pointValue: 10,
    createdAt: Timestamp.now(),
  });
  console.log("✅ Race 1 created:", race1Ref.id);

  const race2Ref = await addDoc(racesRef, {
    name: "Cherry Blossom 10K",
    distance: "10K",
    city: "washington_dc",
    location: "National Mall, Washington DC",
    date: daysFromNow(14),
    url: "https://www.cherryblossom.org",
    participants: [MEMBER_IDS.isabella, MEMBER_IDS.alejandro, adminUid],
    participantCities: {
      [MEMBER_IDS.isabella]:  "washington_dc",
      [MEMBER_IDS.alejandro]: "washington_dc",
      [adminUid]:             "new_york",  // visiting from NY
    },
    confirmedAttendees: [],
    pointValue: 5,
    createdAt: Timestamp.now(),
  });
  console.log("✅ Race 2 created:", race2Ref.id);

  const race3Ref = await addDoc(racesRef, {
    name: "Boston Freedom Trail 5K",
    distance: "5K",
    city: "boston",
    location: "Boston Common, Boston",
    date: daysFromNow(45),
    url: "https://www.baa.org",
    participants: [MEMBER_IDS.diego, MEMBER_IDS.lucas, MEMBER_IDS.valentina],
    participantCities: {
      [MEMBER_IDS.diego]:     "boston",
      [MEMBER_IDS.lucas]:     "boston",
      [MEMBER_IDS.valentina]: "london",  // visiting from London
    },
    confirmedAttendees: [],
    pointValue: 5,
    createdAt: Timestamp.now(),
  });
  console.log("✅ Race 3 created:", race3Ref.id);

  // ─── 5. Past completed runs ────────────────────────────────
  const runsRef = collection(db, "runs");

  await addDoc(runsRef, {
    city: "new_york",
    location: "Central Park 10K Loop",
    date: daysFromNow(-7),
    time: "7:00 AM",
    paceGroup: "moderate",
    status: "completed",
    distanceKm: 10,
    rsvps: [adminUid, MEMBER_IDS.maria, MEMBER_IDS.sofia],
    attendees: [adminUid, MEMBER_IDS.maria, MEMBER_IDS.sofia],
  });

  await addDoc(runsRef, {
    city: "new_york",
    location: "Brooklyn Bridge Promenade",
    date: daysFromNow(-14),
    time: "6:30 AM",
    paceGroup: "easy",
    status: "completed",
    distanceKm: 7,
    rsvps: [adminUid, MEMBER_IDS.maria],
    attendees: [adminUid, MEMBER_IDS.maria],
  });

  await addDoc(runsRef, {
    city: "new_york",
    location: "West Side Highway Long Run",
    date: daysFromNow(-21),
    time: "6:00 AM",
    paceGroup: "fast",
    status: "completed",
    distanceKm: 16,
    rsvps: [adminUid, MEMBER_IDS.sofia, MEMBER_IDS.miguel],
    attendees: [adminUid, MEMBER_IDS.sofia],
  });

  await addDoc(runsRef, {
    city: "new_york",
    location: "Prospect Park Easy 5K",
    date: daysFromNow(-35),
    time: "8:00 AM",
    paceGroup: "easy",
    status: "completed",
    distanceKm: 5,
    rsvps: [adminUid, MEMBER_IDS.maria, MEMBER_IDS.alejandro],
    attendees: [adminUid, MEMBER_IDS.maria, MEMBER_IDS.alejandro],
  });

  console.log("✅ 4 past runs written");

  // ─── 6. Activity feed ──────────────────────────────────────
  const feedRef = collection(db, "activity_feed");
  const feedBatch = writeBatch(db);
  const feedItems = [
    { type: "race_signup",    city: "new_york",      message: "Maria Rodriguez signed up for the NYC Half Marathon 🏅",      timestamp: daysFromNow(-1) },
    { type: "run_completed",  city: "new_york",      message: "Carlos Demo completed the Central Park 10K loop 🏃",           timestamp: daysFromNow(-2) },
    { type: "new_member",     city: "washington_dc", message: "Alejandro Cruz joined the Washington DC chapter! 🎉",           timestamp: daysFromNow(-3) },
    { type: "run_completed",  city: "new_york",      message: "Sofia Vargas logged 16 KM on the West Side Highway route 💪",  timestamp: daysFromNow(-4) },
    { type: "race_signup",    city: "washington_dc", message: "Isabella Moreno signed up for the Cherry Blossom 10K 🌸",      timestamp: daysFromNow(-5) },
    { type: "new_member",     city: "london",        message: "Valentina Lima joined the London chapter! 🇬🇧",                 timestamp: daysFromNow(-6) },
  ];
  for (const item of feedItems) {
    feedBatch.set(doc(feedRef), item);
  }
  await feedBatch.commit();
  console.log("✅ Activity feed written");

  // ─── Done ──────────────────────────────────────────────────
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Demo account ready!");
  console.log("  Email:    demo@latinrunclub.com");
  console.log("  Password: LRC_Demo_2025!");
  console.log("  Role:     Admin ✓  |  City: New York");
  console.log("  Points:   55  |  Runs Attended: 19");
  console.log("  Members:  8 community members seeded");
  console.log("  Races:    3 upcoming (NY, DC, Boston)");
  console.log("  Runs:     4 completed");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message || err);
  if (err.message?.includes("PERMISSION_DENIED") || err.message?.includes("Cloud Firestore API")) {
    console.error("\n  👉 Firestore is not enabled yet.");
    console.error("  Go to: https://console.firebase.google.com");
    console.error("  → latin-run-club → Build → Firestore Database → Create database\n");
  }
  process.exit(1);
});
