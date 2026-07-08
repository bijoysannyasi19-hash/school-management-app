import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalStudents = await this.prisma.student.count();
    const totalTeachers = await this.prisma.teacher.count();
    const pendingInvoices = await this.prisma.feeInvoice.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true }
    });
    const paidInvoices = await this.prisma.feeInvoice.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true }
    });

    return {
      totalStudents,
      totalTeachers,
      financials: {
        pending: pendingInvoices._sum.amount || 0,
        collected: paidInvoices._sum.amount || 0
      }
    };
  }

  async logAction(userId: string, action: string, entity: string, entityId?: string, details?: string) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details
      }
    });
  }

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }
}
