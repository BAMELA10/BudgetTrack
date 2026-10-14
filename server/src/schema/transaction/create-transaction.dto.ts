import { transactionSchema } from './transaction.entity';
import { createZodDto } from 'nestjs-zod';

export const createTransactionSchema = transactionSchema.pick({
  amount: true,
  note: true,
  type: true,
  date: true,
  userId: true,
  categoryId: true,
});
export class CreateTransactionDto extends createZodDto(
  createTransactionSchema,
) {}
