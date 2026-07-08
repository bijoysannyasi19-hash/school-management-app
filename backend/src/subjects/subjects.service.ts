import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllSubjects(classId?: string) {
    return this.prisma.subject.findMany({
      where: classId ? { classId } : undefined,
      include: {
        class: true,
        teacher: {
          include: {
            user: { include: { profile: true } }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async createSubject(name: string, code: string, classId: string, teacherId?: string) {
    return this.prisma.subject.create({
      data: {
        name,
        code,
        classId,
        teacherId,
      },
    });
  }

  async updateSubject(id: string, name: string, code: string, classId: string, teacherId?: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    
    return this.prisma.subject.update({
      where: { id },
      data: {
        name,
        code,
        classId,
        teacherId,
      },
    });
  }

  async deleteSubject(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');

    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
