import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('timetable')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('class/:classId')
  getClassTimetable(@Param('classId') classId: string) {
    return this.timetableService.getClassTimetable(classId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post()
  addPeriod(
    @Body() body: { classId: string; dayOfWeek: number; startTime: string; endTime: string; subjectId: string; teacherId?: string }
  ) {
    return this.timetableService.addPeriod(
      body.classId,
      body.dayOfWeek,
      body.startTime,
      body.endTime,
      body.subjectId,
      body.teacherId
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Delete(':id')
  deletePeriod(@Param('id') id: string) {
    return this.timetableService.deletePeriod(id);
  }
}
