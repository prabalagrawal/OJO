import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data()?.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Admin Guard Error:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ojo-cream">
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 border-4 border-ojo-mustard border-t-transparent rounded-full animate-spin mx-auto shadow-2xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-ojo-mustard">Verifying OJO Credentials</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
