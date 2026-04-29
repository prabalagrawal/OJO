import { Router } from "express";
import prisma from "../../lib/db.ts";
import { authenticate, authorize, AuthRequest } from "../auth/middleware.ts";

const router = Router();

// Get artisan public profile
router.get("/:id", async (req, res) => {
  try {
    const artisan = await prisma.artisan.findUnique({
      where: { id: req.params.id },
      include: { products: { where: { isActive: true } } },
    });
    if (!artisan) return res.status(404).json({ error: "Artisan not found" });
    res.json(artisan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artisan" });
  }
});

// Update artisan profile (Artisan only)
router.put("/me", authenticate, authorize(["ARTISAN"]), async (req: AuthRequest, res) => {
  const { displayName, bio, region, state, craftType } = req.body;
  try {
    const artisan = await prisma.artisan.update({
      where: { userId: req.user!.id },
      data: { displayName, bio, region, state, craftType },
    });
    res.json(artisan);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
