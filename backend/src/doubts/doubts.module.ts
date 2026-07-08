import { Module } from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { DoubtsController } from './doubts.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DoubtsController],
  providers: [DoubtsService, PrismaService],
})
export class DoubtsModule {}
