import { Router } from "express";
import prisma from "../../lib/db.ts";
import { authenticate, authorize, AuthRequest } from "../auth/middleware.ts";

const router = Router();

// Get vendor public profile
router.get("/:id", async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: { products: { where: { verificationStatus: "VERIFIED" } } },
    });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
});

// Update vendor profile (Vendor only)
router.put("/me", authenticate, authorize(["VENDOR"]), async (req: AuthRequest, res) => {
  const { name, description } = req.body;
  try {
    const vendor = await prisma.vendor.update({
      where: { userId: req.user!.id },
      data: { name, description },
    });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
