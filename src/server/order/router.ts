import { Router } from "express";
import prisma from "../../lib/db.ts";
import { authenticate, AuthRequest } from "../auth/middleware.ts";

const router = Router();

// Create order
router.post("/", authenticate, async (req: AuthRequest, res) => {
  const { items, addressId, paymentMethod } = req.body; 
  
  try {
    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const orderNumber = `OJO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        addressId: addressId || 'default-addr-id', // Placeholder for demo
        orderNumber,
        subtotal,
        totalAmount: subtotal + 450, // Shipping placeholder
        status: "PENDING",
        paymentMethod: paymentMethod || "UPI",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            artisanId: item.artisanId || 'default-artisan-id',
            productName: item.name,
            productImage: item.image,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity
          }))
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error("Order creation failed:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get my orders
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get specific order
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: { product: true }
        },
        user: { select: { fullName: true, email: true } }
      }
    });
    
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    // Check ownership
    if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
