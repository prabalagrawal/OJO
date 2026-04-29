import { Router } from "express";
import prisma from "../../lib/db.ts";
import { authenticate, authorize, AuthRequest } from "../auth/middleware.ts";

const router = Router();

// List all active verified products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { 
        isActive: true,
        isOjoVerified: req.query.verified === 'true' ? true : undefined,
        isFeatured: req.query.featured === 'true' ? true : undefined
      },
      include: { 
        artisan: { select: { displayName: true, isVerified: true } },
        category: { select: { name: true, slug: true } }
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { 
        artisan: true, 
        category: true,
        reviews: { include: { user: { select: { fullName: true, avatarUrl: true } } } },
        variants: true
      },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product (Artisan only)
router.post("/", authenticate, authorize(["ARTISAN", "ADMIN"]), async (req: AuthRequest, res) => {
  const { name, description, price, artisanId, categoryId, images, slug } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        artisanId,
        categoryId,
        images: JSON.stringify(images),
        isActive: true,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

export default router;
