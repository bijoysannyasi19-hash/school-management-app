import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, Query } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER, Role.PRINCIPAL)
  @Post()
  createExam(@Body() body: { title: string; date: string; academicYear: string; classId: string }) {
    return this.examsService.createExam(body);
  }

  @Get('class/:classId')
  getExamsByClass(@Param('classId') classId: string) {
    return this.examsService.getExamsByClass(classId);
  }

  @Get(':id/results')
  getExamResults(@Param('id') id: string) {
    return this.examsService.getExamResults(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER, Role.PRINCIPAL)
  @Post(':id/results')
  saveExamResults(@Param('id') id: string, @Body() body: { results: any[] }) {
    return this.examsService.saveExamResults(id, body.results);
  }

  @Get('student/:studentId/report-card')
  getStudentReportCard(
    @Param('studentId') studentId: string, 
    @Query('academicYear') academicYear: string
  ) {
    return this.examsService.getStudentReportCard(studentId, academicYear || '2023-2024');
  }
}
