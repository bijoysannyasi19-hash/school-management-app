import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.CLASS_TEACHER)
  @Post('mark')
  markAttendance(@Body() body: { studentId: string; date: string; status: string; remarks?: string }) {
    return this.attendanceService.markAttendance(
      body.studentId,
      new Date(body.date),
      body.status,
      body.remarks
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.CLASS_TEACHER)
  @Post('bulk-mark')
  bulkMarkAttendance(@Body() body: { records: { studentId: string; date: string; status: string; remarks?: string }[] }) {
    console.log('RECEIVED BODY:', body);
    if (!body || !body.records) {
      throw new Error('Body or records is missing!');
    }
    const formattedRecords = body.records.map(r => ({
      ...r,
      date: new Date(r.date)
    }));
    return this.attendanceService.bulkMarkAttendance(formattedRecords);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Get('student/:studentId')
  getStudentAttendance(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getAttendanceByStudent(
      studentId,
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.CLASS_TEACHER)
  @Get('class/:classId')
  getClassAttendance(
    @Param('classId') classId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getAttendanceByClass(classId, new Date(date));
  }
}
