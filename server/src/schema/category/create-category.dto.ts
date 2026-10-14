import { createZodDto } from 'nestjs-zod';
import { categorySchema } from './category.entity';

export const createCategorySchema = categorySchema.pick({
  name: true,
  color: true,
  userId: true,
});
export class CreateCategoryDto extends createZodDto(createCategorySchema) {}
