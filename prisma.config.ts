import { defineConfig } from '@prisma/config';
import 'dotenv/config'; // Ensure .env is loaded

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL
  },
  studio: {
    url: process.env.DATABASE_URL
  }
});
