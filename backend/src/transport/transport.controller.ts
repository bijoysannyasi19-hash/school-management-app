import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TRANSPORT_MANAGER)
  @Post('routes')
  createRoute(@Body() body: { name: string; startPoint: string; endPoint: string }) {
    return this.transportService.createRoute(body);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TRANSPORT_MANAGER, Role.STUDENT, Role.PARENT, Role.TEACHER)
  @Get('routes')
  getAllRoutes() {
    return this.transportService.getAllRoutes();
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TRANSPORT_MANAGER)
  @Get('vehicles')
  getAllVehicles() {
    return this.transportService.getAllVehicles();
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TRANSPORT_MANAGER)
  @Post('vehicles')
  addVehicle(@Body() body: { number: string; capacity: number; routeId?: string; driverId?: string }) {
    return this.transportService.addVehicle(body);
  }
}
