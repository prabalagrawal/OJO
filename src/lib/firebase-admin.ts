import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";
import fs from "fs";

const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: config.projectId,
  });
}

export const db = getFirestore();
export const auth = admin.auth();
export { admin };
