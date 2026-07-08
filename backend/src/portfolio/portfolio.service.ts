import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getStudentPortfolio(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { include: { profile: true } },
        achievements: true,
        badges: true,
        rewardPoints: true,
        diaryEntries: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    const totalPoints = student?.rewardPoints.reduce((sum, p) => sum + p.points, 0) || 0;

    return {
      studentInfo: student?.user,
      admissionNo: student?.admissionNo,
      achievements: student?.achievements,
      badges: student?.badges,
      totalRewardPoints: totalPoints,
      recentDiaryRemarks: student?.diaryEntries
    };
  }
  async getMyPortfolio(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId: userId },
      include: {
        user: { include: { profile: true } },
        achievements: true,
        badges: true,
        rewardPoints: true,
        diaryEntries: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    if (!student) return null;

    const totalPoints = student.rewardPoints.reduce((sum, p) => sum + p.points, 0);

    return {
      studentInfo: student.user,
      admissionNo: student.admissionNo,
      achievements: student.achievements,
      badges: student.badges,
      totalRewardPoints: totalPoints,
      recentDiaryRemarks: student.diaryEntries
    };
  }
}
