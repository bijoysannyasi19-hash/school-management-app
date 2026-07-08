import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post()
  createEntry(
    @Request() req,
    @Body() body: { studentId: string; type: string; content: string }
  ) {
    return this.diaryService.createEntry(body.studentId, req.user.userId, body.type, body.content);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Get('student/:studentId')
  getStudentDiary(@Param('studentId') studentId: string) {
    return this.diaryService.getStudentDiary(studentId);
  }
}
