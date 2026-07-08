import { Controller, Get, Post, Body, Param, UseGuards, Put, Query } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Post('checkin')
  checkInVisitor(@Body() body: { visitorName: string; purpose: string; hostId?: string }) {
    return this.visitorsService.checkInVisitor(body.visitorName, body.purpose, body.hostId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Get()
  getVisitors(@Query('activeOnly') activeOnly?: string) {
    const includeCheckedOut = activeOnly !== 'true';
    return this.visitorsService.getVisitors(includeCheckedOut);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Put(':id/checkout')
  checkOutVisitor(@Param('id') id: string) {
    return this.visitorsService.checkOutVisitor(id);
  }
}
