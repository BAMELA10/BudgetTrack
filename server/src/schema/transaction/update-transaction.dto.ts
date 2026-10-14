import { createZodDto } from 'nestjs-zod';
import { createTransactionSchema } from './create-transaction.dto';

export const updateTransactionSchema = createTransactionSchema.partial();
export class UpdateTransactionDto extends createZodDto(
  updateTransactionSchema,
) {}
