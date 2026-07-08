import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DoubtsService {
  constructor(private prisma: PrismaService) {}

  async createDoubt(userId: string, subject: string, content: string, isUrgent: boolean = false, taggedTeacherId?: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new Error('Student not found for this user');
    return this.prisma.doubt.create({
      data: { studentId: student.id, subject, content, isUrgent, taggedTeacherId }
    });
  }

  async getDoubts(filters: { subject?: string; isResolved?: boolean; isUrgent?: boolean; teacherId?: string }) {
    const where: any = {};
    if (filters.subject) where.subject = filters.subject;
    if (filters.isResolved !== undefined) where.isResolved = filters.isResolved;
    if (filters.isUrgent !== undefined) where.isUrgent = filters.isUrgent;
    if (filters.teacherId) where.taggedTeacherId = filters.teacherId;

    return this.prisma.doubt.findMany({
      where,
      include: {
        student: { include: { user: { include: { profile: true } } } },
        taggedTeacher: { include: { user: { include: { profile: true } } } },
        replies: {
          include: { author: { include: { profile: true } } },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: [ { isUrgent: 'desc' }, { createdAt: 'desc' } ]
    });
  }

  async replyToDoubt(doubtId: string, authorId: string, content: string) {
    return this.prisma.doubtReply.create({
      data: { doubtId, authorId, content }
    });
  }

  async markResolved(doubtId: string) {
    return this.prisma.doubt.update({
      where: { id: doubtId },
      data: { isResolved: true }
    });
  }
}
