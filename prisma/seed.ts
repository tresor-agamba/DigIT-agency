import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { normalizePhone, phoneSchema } from "../src/lib/validation/phone";

const prisma = new PrismaClient();

async function main() {
  const name = process.env.ADMIN_NAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const parsedPhone = phoneSchema.safeParse(process.env.ADMIN_PHONE);

  if (!name || !password || !parsedPhone.success) {
    throw new Error("ADMIN_NAME, ADMIN_PHONE et ADMIN_PASSWORD valides sont requis pour créer le premier administrateur.");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD doit contenir au moins 12 caractères.");
  }

  const phone = normalizePhone(parsedPhone.data);
  const existingAdmin = await prisma.user.findUnique({ where: { phone } });

  if (existingAdmin) {
    if (existingAdmin.role !== "ADMIN") {
      throw new Error("Le numéro ADMIN_PHONE est déjà associé à un compte client.");
    }
    console.info("Le compte administrateur existe déjà ; aucune modification effectuée.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, phone, passwordHash, role: "ADMIN" } });
  console.info("Compte administrateur créé.");
}

main()
  .catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Échec du seed administrateur."); process.exitCode = 1; })
  .finally(async () => prisma.$disconnect());
