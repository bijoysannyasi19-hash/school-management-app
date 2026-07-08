import { Controller, Get, Post, Body, Param, UseGuards, Put, Request } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Post('alert')
  triggerEmergencyAlert(@Request() req, @Body() body: { type: string; message: string }) {
    return this.safetyService.triggerEmergencyAlert(req.user.userId, body.type, body.message);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Get('alerts')
  getActiveAlerts() {
    return this.safetyService.getActiveAlerts();
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Put('alert/:id/resolve')
  resolveAlert(@Param('id') id: string) {
    return this.safetyService.resolveAlert(id);
  }

  @Post('incident')
  submitIncidentReport(@Request() req, @Body() body: { title: string; description: string }) {
    return this.safetyService.submitIncidentReport(req.user.userId, body.title, body.description);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Get('incidents')
  getIncidentReports() {
    return this.safetyService.getIncidentReports();
  }
}
