import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { SchoolStatsService } from './school-stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('school-stats')
export class SchoolStatsController {
  constructor(private readonly schoolStatsService: SchoolStatsService) {}

  @Get()
  getAllCounters() {
    return this.schoolStatsService.getAllCounters();
  }

  @Get('chart-data')
  getChartData() {
    return this.schoolStatsService.getChartData();
  }

  @Get('activity')
  getRecentActivity() {
    return this.schoolStatsService.getRecentActivity();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Post()
  upsertCounter(@Body() body: { key: string; label: string; value: number; iconUrl?: string; category?: string }) {
    return this.schoolStatsService.upsertCounter(body.key, body.label, body.value, body.iconUrl, body.category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Put(':key/increment')
  incrementCounter(@Param('key') key: string, @Body('amount') amount?: number) {
    return this.schoolStatsService.incrementCounter(key, amount);
  }
}
