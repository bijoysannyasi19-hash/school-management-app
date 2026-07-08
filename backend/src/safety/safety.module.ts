import { Module } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { SafetyController } from './safety.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SafetyController],
  providers: [SafetyService, PrismaService],
})
export class SafetyModule {}
