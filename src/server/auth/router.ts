import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/db.ts";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "ojo-secret-key-123";

router.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = (role === "ADMIN" || role === "VENDOR") ? role : "CUSTOMER";

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: userRole,
      },
    });

    if (userRole === "VENDOR") {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          name: name || "New Vendor",
        },
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

export default router;
