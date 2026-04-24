import { Router } from "express";
import prisma from "../../lib/db.ts";
import { authenticate, authorize, AuthRequest } from "../auth/middleware.ts";

const router = Router();

// List all verified products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { verificationStatus: "VERIFIED" },
      include: { vendor: { select: { name: true, status: true } } },
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
      include: { vendor: true, verificationLogs: true, reviews: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product (Vendor only)
router.post("/", authenticate, authorize(["VENDOR", "ADMIN"]), async (req: AuthRequest, res) => {
  const { name, description, price, origin, stock, images } = req.body;
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user!.id } });
    if (!vendor) return res.status(400).json({ error: "Vendor profile not found" });

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        origin,
        stock: parseInt(stock),
        images,
        vendorId: vendor.id,
        verificationStatus: "PENDING",
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

export default router;
