import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "./firebase";

export const productService = {
  getProducts: async (filters?: { category?: string; origin?: string; limit?: number }) => {
    let q = query(collection(db, "products"));
    
    if (filters?.category) {
      q = query(q, where("category", "==", filters.category));
    }
    if (filters?.origin) {
      q = query(q, where("origin", "==", filters.origin));
    }
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
