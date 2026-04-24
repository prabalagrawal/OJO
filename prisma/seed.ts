import prisma from "../src/lib/db.ts";
import bcrypt from "bcryptjs";

// const prisma = new PrismaClient(); // removed

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const vendorPassword = await bcrypt.hash("vendor123", 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@ojo.co" },
    update: {},
    create: {
      email: "admin@ojo.co",
      password: adminPassword,
      name: "OJO Administrator",
      role: "ADMIN",
    },
  });

  // 2. Create OJO Official Vendor
  const officialUser = await prisma.user.upsert({
    where: { email: "official@ojo.co" },
    update: {},
    create: {
      email: "official@ojo.co",
      password: vendorPassword,
      name: "OJO Official",
      role: "VENDOR",
    },
  });

  const officialVendor = await prisma.vendor.upsert({
    where: { userId: officialUser.id },
    update: {},
    create: {
      userId: officialUser.id,
      name: "OJO Official",
      description: "Direct inventory from OJO heritage sources.",
      status: "APPROVED",
    },
  });

  // 3. Create initial products
  const products = [
    {
      name: "Hand-Woven Pashmina Shawl",
      description: "Authenticated 100% Pashmina from the high altitudes of Ladakh, woven in Srinagar by master craftsmen.",
      price: 24500,
      origin: "Kashmir",
      artisanName: "Ghulam Mohammed",
      color: "Natural Cream",
      dimensions: "2m x 1m",
      story: "Tracing back to the 15th century, the art of Pashmina was brought to Kashmir by Mir Sayyid Ali Hamadani. Each shawl takes months of painstaking labor, beginning with the hand-combing of the Changthangi goat's undercoat.",
      stock: 12,
      verificationStatus: "VERIFIED",
      images: JSON.stringify(["https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670&auto=format&fit=crop"]),
    },
    {
      name: "Blue Pottery Geometric Vase",
      description: "Traditional Jaipur Blue Pottery featuring hand-painted geometric patterns using natural cobalt oxides.",
      price: 3200,
      origin: "Jaipur",
      artisanName: "Rajesh Saini",
      color: "Cobalt Blue",
      dimensions: "12 inch height",
      story: "Jaipur blue pottery is unique because it is the only pottery in the world that does not use clay. It is made from a mix of stone powder, glass, and borax, techniques brought from Persia during the 19th century.",
      stock: 45,
      verificationStatus: "VERIFIED",
      images: JSON.stringify(["https://images.unsplash.com/photo-1578749553570-2cc50ca53017?q=80&w=2670&auto=format&fit=crop"]),
    },
    {
      name: "Chanderi Silk Saree",
      description: "Hand-loomed Chanderi Silk with intricate zari work, passed through 3 levels of quality verification.",
      price: 18900,
      origin: "Madhya Pradesh",
      artisanName: "Anwar Ali",
      color: "Deep Emerald",
      dimensions: "5.5 meters",
      story: "Chanderi weavers have been perfecting their craft since the Vedic period. Known for their sheer texture and glossy transparency, these sarees represent the peak of Indian textile finesse.",
      stock: 8,
      verificationStatus: "VERIFIED",
      images: JSON.stringify(["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2670&auto=format&fit=crop"]),
    },
    {
      name: "Terracotta Horse Figurine",
      description: "Bankura style clay work from West Bengal, representing the distinct ritualistic art form of the region.",
      price: 1500,
      origin: "West Bengal",
      artisanName: "Shanti Pal",
      color: "Burnt Sienna",
      dimensions: "18 inch height",
      story: "The Bankura horse is the most famous example of Terracotta art in India. Its origins lie in the 17th century Malla Dynasty, where it was offered to local deities as a symbol of nobility and strength.",
      stock: 20,
      verificationStatus: "VERIFIED",
      images: JSON.stringify(["https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2670&auto=format&fit=crop"]),
    }
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        ...p,
        vendorId: officialVendor.id,
      },
    });

    // Add 2 reviews per product
    await prisma.review.createMany({
      data: [
        {
          productId: product.id,
          userName: "Anjali Gupta",
          rating: 5,
          comment: "The craftsmanship is unparalleled. You can feel the heritage in every thread.",
        },
        {
          productId: product.id,
          userName: "Vikram Malhotra",
          rating: 4,
          comment: "Truly authentic. The verification badge gave me the confidence to buy.",
        }
      ]
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
