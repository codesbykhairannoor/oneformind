import { defineConfig } from '@prisma/config';
import 'dotenv/config'; // Ensure .env is loaded

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL
  },
  studio: {
    url: process.env.DATABASE_URL
  }
});
