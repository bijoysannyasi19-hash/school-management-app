import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  async getClassTimetable(classId: string) {
    return this.prisma.timetablePeriod.findMany({
      where: { classId },
      include: {
        subject: true,
        teacher: {
          include: {
            user: { include: { profile: true } }
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
  }

  async addPeriod(classId: string, dayOfWeek: number, startTime: string, endTime: string, subjectId: string, teacherId?: string) {
    // Basic check for overlap
    const existing = await this.prisma.timetablePeriod.findFirst({
      where: {
        classId,
        dayOfWeek,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    });

    if (existing) {
      throw new BadRequestException('A period already exists in this time slot for this class.');
    }

    return this.prisma.timetablePeriod.create({
      data: {
        classId,
        dayOfWeek,
        startTime,
        endTime,
        subjectId,
        teacherId
      },
      include: {
        subject: true,
        teacher: {
          include: {
            user: { include: { profile: true } }
          }
        }
      }
    });
  }

  async deletePeriod(id: string) {
    const period = await this.prisma.timetablePeriod.findUnique({ where: { id } });
    if (!period) throw new NotFoundException('Period not found');

    return this.prisma.timetablePeriod.delete({
      where: { id },
    });
  }
}
