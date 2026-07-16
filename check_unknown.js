import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

// load env
const envPath = "/Users/luiscastaneda/Documents/Practice Coding/projectos/Latin-Run-Club/.env";
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
});

const db = getFirestore(app);

async function check() {
  const docRef = doc(db, "users", "unknown");
  const snap = await getDoc(docRef);
  console.log("unknown exists?", snap.exists());
  if (snap.exists()) {
    console.log(snap.data());
  }
}
check();
