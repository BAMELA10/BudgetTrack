import { z } from 'zod';
import { userSchema } from './user';
import { createZodDto } from 'nestjs-zod';

const editUserSchema = userSchema
  .pick({
    email: true,
    name: true,
  })
  .partial();

const editSercretSchema = z
  .object({
    refreshToken: z.string(),
  })
  .partial();

export class EditUserPayload extends createZodDto(editUserSchema) {}
export class EditUserSecretPayload extends createZodDto(editSercretSchema) {}
