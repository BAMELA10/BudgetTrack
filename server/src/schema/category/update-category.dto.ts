import { createZodDto } from "nestjs-zod";
import { createCategorySchema } from "./create-category.dto";

export class UpdateCategoryDto extends createZodDto(createCategorySchema.partial()) {}
