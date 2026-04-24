import { Router } from "express";
import prisma from "../../lib/db.ts";
import { authenticate, AuthRequest } from "../auth/middleware.ts";

const router = Router();

// Create order
router.post("/", authenticate, async (req: AuthRequest, res) => {
  const { items } = req.body; // Array of { productId, quantity }
  
  try {
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    
    let total = 0;
    const orderItemsData = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      total += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        customerId: req.user!.id,
        total,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get my orders
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user!.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
