import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

import { GeneralSkeleton } from "./GeneralSkeleton";

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
        const userData = userDoc.data();
        const userEmail = user.email;

        // Log for debugging (will be visible in dev console)
        console.log("Checking admin access for:", userEmail, "Role:", userData?.role);

        if (
          (userDoc.exists() && userData?.role?.toLowerCase() === 'admin') ||
          userEmail === 'prabalagrawal23@gmail.com'
        ) {
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
    return <GeneralSkeleton />;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
