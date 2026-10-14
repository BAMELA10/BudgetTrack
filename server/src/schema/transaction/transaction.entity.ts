import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { userSchema } from '../user';
import { categorySchema } from '../category';

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.float32(),
  date: z.coerce.date(),
  note: z.string().nullable(),
  type: z.enum(['IN', 'OUT']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
  categoryId: z.string(),
});

export const transactionSchemaWithCategoryAndUser = transactionSchema.extend({
  user: userSchema,
  category: categorySchema,
});
export class TransactionDto extends createZodDto(transactionSchema) {}
export class TransactionWithUserAndCategoryDto extends createZodDto(
  transactionSchemaWithCategoryAndUser,
) {}
