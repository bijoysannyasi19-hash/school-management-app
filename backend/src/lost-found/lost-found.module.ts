import { Module } from '@nestjs/common';
import { LostFoundService } from './lost-found.service';
import { LostFoundController } from './lost-found.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LostFoundController],
  providers: [LostFoundService, PrismaService],
})
export class LostFoundModule {}
