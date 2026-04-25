import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PRODUCTS = [
  {
    name: "Classic Blue Pottery Vase",
    price: 2499,
    origin: "Rajasthan",
    category: "Handicrafts",
    status: "verified",
    description: "Hand-painted using natural cobalt blue dye and quartz powder from Jaipur.",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2070&auto=format&fit=crop"],
    decisionTag: "Most Trusted",
    story: "Created by the Kumhar community of Jaipur, preserving a Persian heritage."
  },
  {
    name: "Pure Kanjeevaram Gold Silk",
    price: 45000,
    origin: "Tamil Nadu",
    category: "Saree",
    status: "live",
    description: "Mulberry silk woven with pure gold zari from the temples of Kanchipuram.",
    images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2610&auto=format&fit=crop"],
    decisionTag: "Premium Pick",
    story: "A single saree takes 3 weeks to weave on a traditional hand-loom."
  },
  {
    name: "Hand-knotted Pashmina Shawl",
    price: 15000,
    origin: "Kashmir",
    category: "Apparel",
    status: "verified",
    description: "Delicate Chyangra goat wool hand-spun and embroidered by master artisans.",
    images: ["https://images.unsplash.com/photo-1594191543882-626dfca15494?q=80&w=2574&auto=format&fit=crop"],
    decisionTag: "Best for Gifting",
    story: "The wool is sourced from the high altitudes of the Himalayas at 15,000 ft."
  }
];

export async function seedDatabase() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (!querySnapshot.empty) {
      console.log("Database already seeded.");
      return;
    }

    for (const prod of PRODUCTS) {
      await addDoc(collection(db, "products"), prod);
    }
    console.log("Seed data injected successfully.");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}
