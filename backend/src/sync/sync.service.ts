import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async getSyncData(userId: string, lastSyncDate: Date) {
    // This is a simplified mock of what a sync payload might look like
    // Mobile apps will call this with their last successful sync timestamp
    // and this endpoint returns data changed since then.

    return {
      timestamp: new Date(),
      alerts: await this.prisma.emergencyAlert.findMany({
        where: { createdAt: { gt: lastSyncDate }, status: 'ACTIVE' }
      }),
      events: await this.prisma.event.findMany({
        where: { date: { gt: lastSyncDate } }
      }),
      // ... Add other entities to sync offline ...
    };
  }
}
