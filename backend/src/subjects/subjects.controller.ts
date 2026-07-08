import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  getAllSubjects(@Query('classId') classId?: string) {
    return this.subjectsService.getAllSubjects(classId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post()
  createSubject(@Body() body: { name: string; code: string; classId: string; teacherId?: string }) {
    return this.subjectsService.createSubject(body.name, body.code, body.classId, body.teacherId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Put(':id')
  updateSubject(
    @Param('id') id: string,
    @Body() body: { name: string; code: string; classId: string; teacherId?: string }
  ) {
    return this.subjectsService.updateSubject(id, body.name, body.code, body.classId, body.teacherId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Delete(':id')
  deleteSubject(@Param('id') id: string) {
    return this.subjectsService.deleteSubject(id);
  }
}
