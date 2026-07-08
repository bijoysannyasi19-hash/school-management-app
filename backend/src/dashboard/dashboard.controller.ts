import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('me')
  getMyDashboard(@Request() req) {
    const role = req.user.role;
    const userId = req.user.userId || req.user.id;

    if (role === 'STUDENT') {
      return this.dashboardService.getStudentDashboard(userId);
    } else if (role === 'TEACHER') {
      return this.dashboardService.getTeacherDashboard(userId);
    }
    
    // For admins, return empty (they fetch from /school-stats)
    return {};
  }
}
