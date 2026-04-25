import { Router } from "express";
import { db } from "../../lib/firebase-admin.ts";
import { authenticate, AuthRequest } from "../auth/middleware.ts";
import { logActivity } from "../middleware/logger.ts";
import { FieldValue } from "firebase-admin/firestore";

const router = Router();

// Create order
router.post("/", authenticate, async (req: AuthRequest, res) => {
  const { items } = req.body; // Array of { productId, quantity, name, price }
  
  try {
    let total = 0;
    items.forEach((item: any) => {
      total += item.price * item.quantity;
    });

    const orderData = {
      userId: req.user!.id,
      customerEmail: req.user!.email,
      total,
      status: "pending",
      items,
      createdAt: FieldValue.serverTimestamp(),
    };

    const orderRef = await db.collection("orders").add(orderData);
    
    // Log Activity
    await logActivity(req, "ORDER_PLACED", `Acquisition executed for total ₹${total.toLocaleString()}`);

    res.status(201).json({ id: orderRef.id, ...orderData });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get my orders
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const snapshot = await db.collection("orders")
      .where("userId", "==", req.user!.id)
      .orderBy("createdAt", "desc")
      .get();
    
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
