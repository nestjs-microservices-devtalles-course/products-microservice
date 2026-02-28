import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = Math.ceil(
      (await this.prisma.product.count({ where: { available: true } })) /
        limit!,
    );

    const skip = (page! - 1) * limit!;

    return {
      data: await this.prisma.product.findMany({
        skip,
        take: limit,
        where: { available: true },
      }),
      meta: {
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id, available: true },
    });

    if (!product)
      throw new NotFoundException(`Product with id #${id} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);

    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    //? Soft Delete - Better for data integrity and historical records
    return await this.prisma.product.update({
      where: { id },
      data: { available: false },
    });

    //!Hard delete
    // return await this.prisma.product.delete({
    //   where: { id },
    // });
  }
}
