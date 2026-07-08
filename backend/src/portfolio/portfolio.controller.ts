import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Roles(Role.STUDENT, Role.PARENT)
  @Get('my')
  getMyPortfolio(@Request() req) {
    return this.portfolioService.getMyPortfolio(req.user.id);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Get('student/:studentId')
  getStudentPortfolio(@Param('studentId') studentId: string) {
    return this.portfolioService.getStudentPortfolio(studentId);
  }
}
