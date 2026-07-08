import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post('points')
  awardPoints(@Body() body: { studentId: string; points: number; reason: string }) {
    return this.gamificationService.awardPoints(body.studentId, body.points, body.reason);
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.gamificationService.getLeaderboard();
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post('badge')
  awardBadge(@Body() body: { studentId: string; name: string; iconUrl: string }) {
    return this.gamificationService.awardBadge(body.studentId, body.name, body.iconUrl);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post('achievement')
  awardAchievement(@Body() body: { studentId: string; title: string; category: string; description: string; academicYear?: string }) {
    return this.gamificationService.awardAchievement(body.studentId, body.title, body.category, body.description, body.academicYear);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Get('timeline/:studentId')
  getAchievementTimeline(@Param('studentId') studentId: string) {
    return this.gamificationService.getAchievementTimeline(studentId);
  }
}
