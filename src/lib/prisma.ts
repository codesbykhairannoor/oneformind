import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

// Vercel Hobby Plan: Keep max connections low to avoid exhausting DB.
// Serverless functions can spin up many instances, each creating a pool.
// max: 2 means each lambda instance uses at most 2 DB connections.
const pool = new Pool({
  connectionString,
  max: 2,                      // Max 2 connections per serverless instance
  connectionTimeoutMillis: 10000, // 10s timeout to get a connection
  idleTimeoutMillis: 30000,    // Release idle connections after 30s
  allowExitOnIdle: true,       // Allow Node to exit cleanly
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaPg(pool) });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

