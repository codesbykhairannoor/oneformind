const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.plannerTask.findMany();
  console.log(tasks);
}

main().catch(console.error).finally(() => prisma.$disconnect());
