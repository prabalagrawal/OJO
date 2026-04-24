import { Router } from "express";
import prisma from "../../lib/db.ts";
import { authenticate, authorize, AuthRequest } from "../auth/middleware.ts";

const router = Router();

// Get all vendors (Admin)
router.get("/vendors", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({ include: { user: { select: { email: true } } } });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// Update vendor status (Admin)
router.patch("/vendors/:id/status", authenticate, authorize(["ADMIN"]), async (req, res) => {
  const { status } = req.body;
  try {
    const vendor = await prisma.vendor.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: "Failed to update vendor status" });
  }
});

// Get pending products (Admin)
router.get("/products/pending", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { verificationStatus: "PENDING" },
      include: { vendor: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending products" });
  }
});

// Verify product (Admin)
router.post("/products/:id/verify", authenticate, authorize(["ADMIN"]), async (req: AuthRequest, res) => {
  const { status, comments } = req.body; // status: VERIFIED or REJECTED
  try {
    const product = await prisma.$transaction([
      prisma.product.update({
        where: { id: req.params.id },
        data: { verificationStatus: status },
      }),
      prisma.verificationLog.create({
        data: {
          productId: req.params.id,
          adminId: req.user!.id,
          status,
          comments,
        },
      }),
    ]);
    res.json(product[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to verify product" });
  }
});

export default router;
