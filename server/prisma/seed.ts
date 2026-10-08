/**
 * Idempotent seed: permissions, system roles, default leave types, a starter
 * department and the initial Super Admin account. Safe to re-run.
 *   npm run db:seed
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ALL_PERMISSIONS, DEFAULT_ROLES, describePermission } from "../src/config/permissions.js";

const prisma = new PrismaClient();

const LEAVE_TYPES = [
  { name: "Annual Leave", code: "AL", annualAllowance: 20, isPaid: true, color: "#5D5FEF", carryForwardMax: 5 },
  { name: "Sick Leave", code: "SL", annualAllowance: 10, isPaid: true, color: "#F59E0B" },
  { name: "Casual Leave", code: "CL", annualAllowance: 5, isPaid: true, color: "#10B981" },
  { name: "Unpaid Leave", code: "UL", annualAllowance: 0, isPaid: false, color: "#8E8E9C" },
];

async function main() {
  for (const key of ALL_PERMISSIONS) {
    const { module, action } = describePermission(key);
    await prisma.permission.upsert({ where: { key }, create: { key, module, action }, update: { module, action } });
  }
  const perms = await prisma.permission.findMany();
  const idOf = new Map(perms.map((p) => [p.key, p.id]));

  for (const def of DEFAULT_ROLES) {
    const role = await prisma.role.upsert({
      where: { name: def.name },
      create: { name: def.name, description: def.description, isSystem: true },
      update: { description: def.description, isSystem: true },
    });
    const existing = await prisma.rolePermission.count({ where: { roleId: role.id } });
    // Only set defaults on first seed (or always for Super Admin) so admin customisations survive re-seeding.
    if (existing === 0 || def.name === "Super Admin") {
      await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
      await prisma.rolePermission.createMany({ data: def.permissions.map((k) => ({ roleId: role.id, permissionId: idOf.get(k)! })) });
    }
  }

  for (const t of LEAVE_TYPES) {
    await prisma.leaveType.upsert({ where: { code: t.code }, create: t, update: {} });
  }

  const dept = await prisma.department.upsert({
    where: { name: "Administration" },
    create: { name: "Administration", description: "Company administration" },
    update: {},
  });

  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@company.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  const superAdmin = await prisma.role.findUniqueOrThrow({ where: { name: "Super Admin" } });
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (!existingAdmin) {
    const user = await prisma.user.create({
      data: { email, passwordHash: await bcrypt.hash(password, 12), status: "ACTIVE", roleId: superAdmin.id },
    });
    const today = new Date();
    await prisma.employee.create({
      data: {
        userId: user.id,
        employeeCode: "EMP-0001",
        firstName: "System",
        lastName: "Administrator",
        designation: "Administrator",
        joiningDate: new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())),
        departmentId: dept.id,
      },
    });
    console.info(`Created Super Admin ${email} — change the password after first login.`);
  } else {
    console.info(`Super Admin ${email} already exists — left unchanged.`);
  }
  console.info(`Seeded ${ALL_PERMISSIONS.length} permissions, ${DEFAULT_ROLES.length} roles, ${LEAVE_TYPES.length} leave types.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
