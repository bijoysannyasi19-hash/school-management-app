import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async markAttendance(studentId: string, date: Date, status: string, remarks?: string) {
    return this.prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date,
        },
      },
      update: {
        status,
        remarks,
      },
      create: {
        studentId,
        date,
        status,
        remarks,
      },
    });
  }

  async bulkMarkAttendance(records: { studentId: string; date: Date; status: string; remarks?: string }[]) {
    const saved: any[] = [];
    for (const record of records) {
      saved.push(await this.markAttendance(record.studentId, record.date, record.status, record.remarks));
    }
    return saved;
  }

  async getAttendanceByStudent(studentId: string, startDate: Date, endDate: Date) {
    return this.prisma.attendance.findMany({
      where: {
        studentId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getAttendanceByClass(classId: string, date: Date) {
    // Finds all students in a class and their attendance for a specific date
    return this.prisma.studentClass.findMany({
      where: { classId },
      include: {
        student: {
          include: {
            user: { include: { profile: true } },
            attendance: {
              where: { date }
            }
          }
        }
      }
    });
  }
}
