import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        classTeacher: {
          include: { user: { include: { profile: true } } }
        },
        subjects: true,
        students: {
          include: { student: { include: { user: { include: { profile: true } } } } }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.class.findUnique({
      where: { id },
      include: {
        classTeacher: true,
        subjects: {
          include: { teacher: true }
        },
        students: {
          include: { student: { include: { user: { include: { profile: true } } } } }
        }
      }
    });
  }

  async create(data: { name: string; section: string; teacherId?: string }) {
    return this.prisma.class.create({
      data: {
        name: data.name,
        section: data.section,
        teacherId: data.teacherId,
      }
    });
  }

  async assignStudent(classId: string, studentId: string, academicYear: string) {
    return this.prisma.studentClass.create({
      data: {
        studentId,
        classId,
        academicYear,
      }
    });
  }

  async addSubject(classId: string, data: { name: string; code: string; teacherId?: string }) {
    return this.prisma.subject.create({
      data: {
        name: data.name,
        code: data.code,
        classId,
        teacherId: data.teacherId
      }
    });
  }
}
