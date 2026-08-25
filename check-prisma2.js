const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: '109344902988196691842'
        }
      },
      select: { user: true }
    });
    console.log('findUnique Account:', account);
  } catch(e) {
    console.error('findUnique Error:', e);
  }
}

main().finally(() => prisma.$disconnect());
