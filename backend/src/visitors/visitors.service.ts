import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VisitorsService {
  constructor(private prisma: PrismaService) {}

  async checkInVisitor(visitorName: string, purpose: string, hostId?: string) {
    return this.prisma.visitorPass.create({
      data: { visitorName, purpose, hostId }
    });
  }

  async checkOutVisitor(passId: string) {
    return this.prisma.visitorPass.update({
      where: { id: passId },
      data: { checkOut: new Date() }
    });
  }

  async getVisitors(includeCheckedOut: boolean = true) {
    const where = includeCheckedOut ? {} : { checkOut: null };
    return this.prisma.visitorPass.findMany({
      where,
      include: { host: { include: { profile: true } } },
      orderBy: { checkIn: 'desc' }
    });
  }
}
