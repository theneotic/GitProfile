import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  WEB_BASE_URL: z.string().default('http://localhost:3000'),
  API_BASE_URL: z.string().default('http://localhost:4000'),
  GITHUB_CLIENT_ID: z.string().default('dummy-client-id'),
  GITHUB_CLIENT_SECRET: z.string().default('dummy-client-secret'),
  GITHUB_TOKEN: z.string().optional(),
  JWT_SECRET: z.string().default('instrument-stats-super-secret-jwt-signing-key-for-dev-32chars'),
  JWT_REFRESH_SECRET: z.string().default('instrument-stats-super-secret-refresh-key-for-dev-32chars'),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
