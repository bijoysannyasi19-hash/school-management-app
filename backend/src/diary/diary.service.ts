import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DiaryService {
  constructor(private prisma: PrismaService) {}

  async createEntry(studentId: string, userId: string, type: string, content: string) {
    let teacher = await this.prisma.teacher.findUnique({
      where: { userId }
    });
    
    // If not a teacher (e.g. an Admin), just pick the first teacher as a fallback
    // In a real system, you'd make teacherId optional or have an Admin model
    if (!teacher) {
      teacher = await this.prisma.teacher.findFirst();
    }
    
    if (!teacher) {
      throw new Error('No teachers available to create diary entries');
    }

    return this.prisma.studentDiaryEntry.create({
      data: { studentId, teacherId: teacher.id, type, content }
    });
  }

  async getStudentDiary(studentId: string) {
    return this.prisma.studentDiaryEntry.findMany({
      where: { studentId },
      include: { teacher: { include: { user: { include: { profile: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
