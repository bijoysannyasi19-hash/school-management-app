import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async awardPoints(studentId: string, points: number, reason: string) {
    return this.prisma.rewardPoint.create({
      data: { studentId, points, reason }
    });
  }

  async getPoints(studentId: string) {
    const points = await this.prisma.rewardPoint.aggregate({
      where: { studentId },
      _sum: { points: true }
    });
    return points._sum.points || 0;
  }

  async getLeaderboard() {
    // In a real app, this would be a complex query. We'll simulate by getting students and their total points.
    // For now, returning raw points data aggregated
    const points = await this.prisma.rewardPoint.groupBy({
      by: ['studentId'],
      _sum: { points: true },
      orderBy: { _sum: { points: 'desc' } },
      take: 10
    });
    
    // We need to enrich this with student details (this is a simplified approach)
    const leaderboard = await Promise.all(points.map(async p => {
      const student = await this.prisma.student.findUnique({
        where: { id: p.studentId },
        include: { user: { include: { profile: true } } }
      });
      return {
        student,
        totalPoints: p._sum.points
      };
    }));
    return leaderboard;
  }

  async awardBadge(studentId: string, name: string, iconUrl: string) {
    return this.prisma.studentBadge.create({
      data: { studentId, name, iconUrl }
    });
  }

  async awardAchievement(studentId: string, title: string, category: string, description: string, academicYear?: string) {
    return this.prisma.achievement.create({
      data: { studentId, title, category, description, academicYear }
    });
  }

  async getAchievementTimeline(studentId: string) {
    const achievements = await this.prisma.achievement.findMany({
      where: { studentId },
      orderBy: { dateEarned: 'desc' }
    });

    // Group by academicYear or 'All-Time'
    const timeline = achievements.reduce((acc, curr) => {
      const year = curr.academicYear || 'All-Time';
      if (!acc[year]) acc[year] = [];
      acc[year].push(curr);
      return acc;
    }, {} as Record<string, any[]>);

    return timeline;
  }
}
