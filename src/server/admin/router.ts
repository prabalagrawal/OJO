import { Router } from "express";
import { db } from "../../lib/firebase-admin.ts";
import { authenticate, authorize, AuthRequest } from "../auth/middleware.ts";
import { FieldValue } from "firebase-admin/firestore";

const router = Router();

// Get Activity Logs (Admin)
router.get("/logs", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    const snapshot = await db.collection("activity_logs")
      .orderBy("timestamp", "desc")
      .limit(50)
      .get();
    
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// Get all orders (Admin)
router.get("/orders", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    const snapshot = await db.collection("orders")
      .orderBy("createdAt", "desc")
      .get();
    
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status (Admin)
router.patch("/orders/:id/status", authenticate, authorize(["ADMIN"]), async (req, res) => {
  const { status } = req.body;
  try {
    await db.collection("orders").doc(req.params.id).update({ status });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
