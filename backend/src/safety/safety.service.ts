import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SafetyService {
  constructor(private prisma: PrismaService) {}

  async triggerEmergencyAlert(reportedBy: string, type: string, message: string) {
    return this.prisma.emergencyAlert.create({
      data: { reportedBy, type, message, status: 'ACTIVE' }
    });
  }

  async getActiveAlerts() {
    return this.prisma.emergencyAlert.findMany({
      where: { status: 'ACTIVE' },
      include: { reporter: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async resolveAlert(alertId: string) {
    return this.prisma.emergencyAlert.update({
      where: { id: alertId },
      data: { status: 'RESOLVED' }
    });
  }

  async submitIncidentReport(reportedBy: string, title: string, description: string) {
    return this.prisma.incidentReport.create({
      data: { reportedBy, title, description }
    });
  }

  async getIncidentReports() {
    return this.prisma.incidentReport.findMany({
      include: { reporter: { include: { profile: true } } },
      orderBy: { date: 'desc' }
    });
  }
}
