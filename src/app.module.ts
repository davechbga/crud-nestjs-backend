import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ProductsModule],
  providers: [PrismaService],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
