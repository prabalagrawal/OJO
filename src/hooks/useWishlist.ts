import { useState, useCallback, useEffect } from "react";
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Product } from "../data/product-dataset";
import { toast } from "sonner";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setWishlist([]);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const wishlistRef = collection(db, `users/${user.uid}/wishlist`);
    const q = query(wishlistRef);
    
    const unsub = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.id);
      setWishlist(ids);
      setLoading(false);
    }, (err) => {
      console.error("Wishlist snapshot error", err);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const toggleWishlist = useCallback(async (product: Product) => {
    if (!user) {
      toast.error("Please login to save to wishlist");
      return;
    }

    const docRef = doc(db, `users/${user.uid}/wishlist`, product.id);
    const isWished = wishlist.includes(product.id);

    try {
      if (isWished) {
        await deleteDoc(docRef);
        toast.success("Removed from wishlist");
      } else {
        await setDoc(docRef, {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString()
        });
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Error toggling wishlist", err);
      toast.error("Failed to update wishlist");
    }
  }, [user, wishlist]);

  return {
    wishlist,
    toggleWishlist,
    isLoading: loading,
    isWished: (productId: string) => wishlist.includes(productId)
  };
}
