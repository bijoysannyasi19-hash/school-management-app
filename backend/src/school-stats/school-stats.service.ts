import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchoolStatsService {
  constructor(private prisma: PrismaService) {}

  async upsertCounter(key: string, label: string, value: number, iconUrl?: string, category?: string) {
    return this.prisma.schoolDashboardCounter.upsert({
      where: { key },
      update: { label, value, iconUrl, category },
      create: { key, label, value, iconUrl, category }
    });
  }

  async getAllCounters() {
    // 1. Get Live Total Students
    const totalStudents = await this.prisma.student.count();
    
    // 2. Get Live Total Teachers
    const totalTeachers = await this.prisma.teacher.count();
    
    // 3. Calculate Live Attendance Rate for Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const presentCount = await this.prisma.attendance.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        },
        status: 'PRESENT'
      }
    });
    
    const attendanceRate = totalStudents > 0 
      ? Math.round((presentCount / totalStudents) * 100) 
      : 0;

    // 4. Calculate Live Monthly Revenue
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const paymentsThisMonth = await this.prisma.feePayment.findMany({
      where: {
        date: {
          gte: firstDayOfMonth
        }
      }
    });
    
    const monthlyRevenue = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);

    // Return the array format expected by the clients
    return [
      { key: 'total_students', label: 'Total Students', value: totalStudents },
      { key: 'total_teachers', label: 'Total Teachers', value: totalTeachers },
      { key: 'attendance_rate', label: 'Attendance Rate', value: attendanceRate },
      { key: 'monthly_revenue', label: 'Monthly Revenue', value: monthlyRevenue }
    ];
  }

  async incrementCounter(key: string, amount: number = 1) {
    return this.prisma.schoolDashboardCounter.update({
      where: { key },
      data: { value: { increment: amount } }
    });
  }

  async getChartData() {
    // Mocking 6 months of revenue data for the chart since we don't have historical aggregates in the schema
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      name: month,
      revenue: 50000 + Math.random() * 50000 + (index * 10000), // Increasing trend
    }));
  }

  async getRecentActivity() {
    const activities = await this.prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    if (activities.length > 0) {
      return activities;
    }

    // Return dummy data if no audit logs exist yet
    return [
      { id: '1', action: 'Created new class 10A', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: '2', action: 'Fee payment received from Student #1042', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      { id: '3', action: 'Published new notice regarding exams', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: '4', action: 'Added 5 new books to library', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    ];
  }
}
