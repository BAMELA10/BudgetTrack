import { Injectable } from '@nestjs/common';
import {
  CreateTransactionDto,
  TransactionDto,
  UpdateTransactionDto,
} from '../schema';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return await this.prisma.transaction.create({
      data: createTransactionDto,
      omit: { isDeleted: true },
    });
  }

  async findAll(
    limit: number,
    page?: number,
  ): Promise<{ totalPages: number; data: TransactionDto[]; page: number }> {
    if (!page) {
      const transactions = await this.prisma.transaction.findMany({
        omit: { isDeleted: true },
      });
      return { totalPages: 1, data: transactions, page: 1 };
    }
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const safePage = Math.max(1, page ?? 1);

    const count = await this.prisma.transaction.count();
    const pages = Math.ceil(count / safeLimit); //total de page
    const skip = safeLimit * (safePage - 1);
    const transactions = await this.prisma.transaction.findMany({
      skip,
      take: safeLimit,
      omit: { isDeleted: true },
    });
    return { totalPages: pages, data: transactions, page: safePage };
  }

  async findOne(id: string): Promise<TransactionDto> {
    return await this.prisma.transaction.findUniqueOrThrow({
      where: { id },
      omit: { isDeleted: true },
    });
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    return await this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
      omit: { isDeleted: true },
    });
  }

  async remove(id: string) {
    return await this.prisma.transaction.update({
      where: { id },
      data: { isDeleted: true },
      omit: { isDeleted: true },
    });
  }
}
