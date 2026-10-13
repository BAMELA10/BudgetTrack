import { z } from 'zod';

export const envSchema = z.object({
  // Environnement
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  // PostgreSQL (variables séparées)
  POSTGRES_DB: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),

  // Database
  DATABASE_NAME: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().positive().default(5432),
  DATABASE_URL: z.string(),
  // SMTP
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  JWT_SECRET: z.string().min(1).optional(),
  REFRESH_SECRET_JWT: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;
