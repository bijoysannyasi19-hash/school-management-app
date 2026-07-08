import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Get(':id/students')
  async getStudentsByClass(@Param('id') id: string) {
    const classData = await this.classesService.findOne(id);
    if (!classData) return [];
    return classData.students.map(sc => sc.student);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Post()
  create(@Body() body: { name: string; section: string; teacherId?: string }) {
    return this.classesService.create(body);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post(':id/assign-student')
  assignStudent(@Param('id') classId: string, @Body() body: { studentId: string; academicYear: string }) {
    return this.classesService.assignStudent(classId, body.studentId, body.academicYear);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Post(':id/subjects')
  addSubject(@Param('id') classId: string, @Body() body: { name: string; code: string; teacherId?: string }) {
    return this.classesService.addSubject(classId, body);
  }
}
