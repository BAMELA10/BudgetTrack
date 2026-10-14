import { Injectable } from '@nestjs/common';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../schema';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    return await this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(
    limit: number,
    page?: number,
  ): Promise<{ totalPages: number; data: CategoryDto[]; page: number }> {
    if (!page) {
      const categories = await this.prisma.category.findMany({
        where: { isDeleted: false },
      });
      return { totalPages: 1, data: categories, page: 1 };
    }
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const count = await this.prisma.category.count();
    const pages = Math.ceil(count / safePage);
    const skip = safeLimit * (safePage - 1);

    const categories = await this.prisma.category.findMany({
      where: { isDeleted: false },
      skip,
      take: safeLimit,
    });

    return { totalPages: pages, data: categories, page: safePage };
  }

  async findOne(id: string): Promise<CategoryDto> {
    return await this.prisma.category.findFirstOrThrow({ where: { id } });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
