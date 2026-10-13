import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const userWithSecretsSchema = userSchema.extend({
  secret: z
    .object({
      id: z.string(),
      password: z.string(),
      lastSignedIn: z.coerce.date(),
      refreshToken: z.string().nullable(),
    })
    .nullable(),
});

export class UserDto extends createZodDto(userSchema) {}
export class UserWithSecret extends createZodDto(userWithSecretsSchema) {}
