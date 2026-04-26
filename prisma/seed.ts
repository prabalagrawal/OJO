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
  const regions = [
    { id: "AP", name: "Andhra Pradesh", items: ["Kondapalli Toys", "Dharmavaram Silk"] },
    { id: "AR", name: "Arunachal Pradesh", items: ["Apatani Weaves", "Monpa Wood Craft"] },
    { id: "AS", name: "Assam", items: ["Muga Silk", "Bamboo Craft"] },
    { id: "BR", name: "Bihar", items: ["Madhubani Painting", "Bhagalpury Silk"] },
    { id: "CH", name: "Chandigarh", items: ["Le Corbusier Inspired Craft", "Heritage Furniture"] },
    { id: "CT", name: "Chhattisgarh", items: ["Dhokra Art", "Kosa Silk"] },
    { id: "DN", name: "Dadra Nagar Haveli", items: ["Warli Art Sculpture", "Leather Craft"] },
    { id: "DL", name: "Delhi", items: ["Meenakari Jewellery", "Zardozi Work"] },
    { id: "GA", name: "Goa", items: ["Azuljos Tiles", "Kunbi Saree"] },
    { id: "GJ", name: "Gujarat", items: ["Patola Silk", "Ajrakh Prints"] },
    { id: "HR", name: "Haryana", items: ["Terracotta Artifacts", "Brassware"] },
    { id: "HP", name: "Himachal Pradesh", items: ["Kullu Shawl", "Kangra Painting"] },
    { id: "JK", name: "Jammu and Kashmir", items: ["Pashmina Shawl", "Walnut Wood Carving"] },
    { id: "JH", name: "Jharkhand", items: ["Sohrai Art", "Tussar Silk"] },
    { id: "KA", name: "Karnataka", items: ["Mysore Silk", "Channapatna Toys"] },
    { id: "KL", name: "Kerala", items: ["Aranmula Mirror", "Kasavu Saree"] },
    { id: "LA", name: "Ladakh", items: ["Changpa Pashmina", "Apricot Wood Craft"] },
    { id: "LD", name: "Lakshadweep", items: ["Coir Decorative Shells", "Coral Inspired Art"] },
    { id: "MP", name: "Madhya Pradesh", items: ["Chanderi Saree", "Bagh Prints"] },
    { id: "MH", name: "Maharashtra", items: ["Paithani Saree", "Warli Tribal Art"] },
    { id: "MN", name: "Manipur", items: ["Longpi Pottery", "Meithei Handloom"] },
    { id: "ML", name: "Meghalaya", items: ["Cane Picnic Basket", "Eri Silk Stole"] },
    { id: "MZ", name: "Mizoram", items: ["Puan Textiles", "Bamboo Hat"] },
    { id: "NL", name: "Nagaland", items: ["Naga Shawl", "Basketry"] },
    { id: "OR", name: "Odisha", items: ["Pattachitra", "Sambalpuri Ikat"] },
    { id: "PB", name: "Punjab", items: ["Phulkari Dupatta", "Leather Jutti"] },
    { id: "PY", name: "Puducherry", items: ["Auroville Handmade Paper", "Terracotta Lamps"] },
    { id: "RJ", name: "Rajasthan", items: ["Blue Pottery", "Sanganeri Handblock"] },
    { id: "SK", name: "Sikkim", items: ["Thangka Painting", "Handwoven Carpet"] },
    { id: "TN", name: "Tamil Nadu", items: ["Kanchipuram Silk", "Thanjavur Painting"] },
    { id: "TG", name: "Telangana", items: ["Bidriware Vase", "Pochampally Ikat"] },
    { id: "TR", name: "Tripura", items: ["Bamboo Sculpture", "Woven Shawl"] },
    { id: "UP", name: "Uttar Pradesh", items: ["Banarasi Saree", "Lucknow Chikan"] },
    { id: "UK", name: "Uttarakhand", items: ["Aipan Art Frame", "Ringal Bamboo Craft"] },
    { id: "WB", name: "West Bengal", items: ["Bankura Terracotta", "Darjeeling Loose Leaf"] }
  ];

  const productTemplates = [
    {
      price: [2500, 4500, 12000, 25000],
      stories: [
        "A legacy technique passed through 7 generations of master craftsmen.",
        "Verified by OJO regional field agents for 100% material authenticity.",
        "An iconic example of geographic protected heritage from the heart of the cluster."
      ],
      artisans: ["Master Rajesh", "Begum Zeba", "Devi Prasad", "Shanti Pal", "Anwar Ali"]
    }
  ];

  for (const region of regions) {
    for (const itemName of region.items) {
      const template = productTemplates[0];
      const product = await prisma.product.create({
        data: {
          name: `${itemName} - Verified Record`,
          description: `A premium example of ${itemName} heritage, strictly audited for provenance and material trust.`,
          price: template.price[Math.floor(Math.random() * template.price.length)],
          origin: region.name,
          artisanName: template.artisans[Math.floor(Math.random() * template.artisans.length)],
          story: template.stories[Math.floor(Math.random() * template.stories.length)],
          stock: 10,
          verificationStatus: "VERIFIED",
          images: JSON.stringify(["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop"]),
          vendorId: officialVendor.id,
        },
      });

      // Add reviews
      await prisma.review.create({
        data: {
          productId: product.id,
          userName: "OJO Auditor",
          rating: 5,
          comment: "Provenance verified via field audit. GI-Tag compliance confirmed.",
        }
      });
    }
  }

  console.log(`Created ${regions.length * 2} heritage records successfully`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
