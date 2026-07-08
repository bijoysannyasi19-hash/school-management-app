import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [VisitorsController],
  providers: [VisitorsService, PrismaService],
})
export class VisitorsModule {}
