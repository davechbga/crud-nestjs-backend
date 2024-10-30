import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prismaService.product.create({
        data: createProductDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Product with name ${createProductDto.name} already exists`,
          );
        }
      }

      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: number) {
    const productFound = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!productFound) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return productFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.prismaService.product.update({
        where: { id },
        data: updateProductDto,
      });

      if (!updatedProduct) {
        throw new NotFoundException(`Product #${id} not found`);
      }

      return updatedProduct;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 es el código de error para violación de restricción única
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Product with name ${updateProductDto.name} already exists`,
          );
        }
        // P2025 es el código para registro no encontrado
        if (error.code === 'P2025') {
          throw new NotFoundException(`Product #${id} not found`);
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const productRemoved = await this.prismaService.product.delete({
      where: { id },
    });

    if (!productRemoved) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return productRemoved;
  }
}
