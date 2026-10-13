import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
});

export class CreateUserPayload extends createZodDto(createUserSchema) {}
