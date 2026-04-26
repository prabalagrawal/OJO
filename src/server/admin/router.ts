import { Router } from "express";
import prisma from "../../lib/db.ts";
import { authenticate, authorize, AuthRequest } from "../auth/middleware.ts";

const router = Router();

// Get Admin Stats
router.get("/stats", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    const [totalProducts, pendingProducts, totalOrders, totalUsers, totalVendors] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { verificationStatus: "PENDING" } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.vendor.count()
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { name: true, email: true } } }
    });

    res.json({
      totalProducts,
      pendingProducts,
      totalOrders,
      totalUsers,
      totalVendors,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Get Pending Products for Audit
router.get("/products/pending", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { verificationStatus: "PENDING" },
      include: { vendor: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending products" });
  }
});

// Authorize/Reject Product
router.post("/products/:id/verify", authenticate, authorize(["ADMIN"]), async (req: AuthRequest, res) => {
  const { status, comments } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { 
        verificationStatus: status,
        verificationLogs: {
          create: {
            adminId: req.user!.id,
            status,
            comments
          }
        }
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Get all orders (Admin)
router.get("/orders", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { 
        customer: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status (Admin)
router.patch("/orders/:id/status", authenticate, authorize(["ADMIN"]), async (req, res) => {
  const { status } = req.body;
  try {
    await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
