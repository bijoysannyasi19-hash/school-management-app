import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStudentDashboard(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        rewardPoints: true,
        classes: {
          include: {
            class: true
          }
        },
        attendance: true,
      }
    });

    if (!student) return { error: 'Student not found' };

    // Calculate attendance rate
    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter(a => a.status === 'PRESENT').length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    const totalRewardPoints = student.rewardPoints.reduce((sum, p) => sum + p.points, 0);

    // Get assignments for their class
    const classIds = student.classes.map(sc => sc.classId);
    let pendingAssignments = 0;
    
    if (classIds.length > 0) {
      const classWorkspaces = await this.prisma.classWorkspace.findMany({
        where: { classId: { in: classIds } },
        include: { assignments: { include: { submissions: { where: { studentId: student.id } } } } }
      });
      
      classWorkspaces.forEach(cw => {
        cw.assignments.forEach(assignment => {
          if (assignment.submissions.length === 0) {
            pendingAssignments++;
          }
        });
      });
    }

    // Activity
    const recentActivity = student.rewardPoints.slice(0, 5).map(p => ({
      id: p.id,
      action: `Received ${p.points} points for: ${p.reason}`,
      createdAt: p.awardedAt
    }));

    return {
      attendanceRate,
      totalRewardPoints,
      pendingAssignments,
      recentActivity
    };
  }

  async getTeacherDashboard(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
      include: {
        classes: true,
        diaryEntries: true
      }
    });

    if (!teacher) return { error: 'Teacher not found' };

    const totalClasses = teacher.classes.length;

    // Get grading load (submissions waiting to be graded)
    let pendingGrading = 0;
    if (totalClasses > 0) {
      const workspaces = await this.prisma.classWorkspace.findMany({
        where: { classId: { in: teacher.classes.map(c => c.id) } },
        include: { assignments: { include: { submissions: { where: { grade: null } } } } }
      });
      
      workspaces.forEach(cw => {
        cw.assignments.forEach(assignment => {
          pendingGrading += assignment.submissions.length;
        });
      });
    }

    const recentActivity = teacher.diaryEntries.slice(0, 5).map(d => ({
      id: d.id,
      action: `Wrote a diary entry`,
      createdAt: d.createdAt
    }));

    return {
      totalClasses,
      pendingGrading,
      recentActivity
    };
  }
}
