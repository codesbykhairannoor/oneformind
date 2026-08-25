const { PrismaClient } = require('@prisma/client');
// Initialize Prisma without the adapter, just standard Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.esahuobozjxkyjvpxslu:Khairanaja09@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'
    }
  }
});

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
