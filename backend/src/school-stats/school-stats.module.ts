import { Module } from '@nestjs/common';
import { SchoolStatsService } from './school-stats.service';
import { SchoolStatsController } from './school-stats.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SchoolStatsController],
  providers: [SchoolStatsService, PrismaService],
})
export class SchoolStatsModule {}
