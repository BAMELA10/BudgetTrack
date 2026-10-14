import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
});

// model Category {
//     id  String  @default(uuid()) @id
//     userId  String
//     user    User    @relation(fields:[userId], references:[id], onDelete: Cascade)
//     name    String
//     color   String
//     createdAt    DateTime    @default(now())
//     updatedAt    DateTime    @default(now())
//     transaction Transaction[]
//     buget Budget[]
//     isDeleted   Boolean      @default(false)
// }

export class CategoryDto extends createZodDto(categorySchema) {}
