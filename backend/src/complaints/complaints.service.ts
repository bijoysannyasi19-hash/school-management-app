import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async submitComplaint(title: string, description: string, authorId: string | null) {
    return this.prisma.complaint.create({
      data: {
        title,
        description,
        authorId,
        status: 'OPEN'
      }
    });
  }

  async getComplaints(userId?: string) {
    const where = userId ? { authorId: userId } : {};
    return this.prisma.complaint.findMany({
      where,
      include: { author: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(complaintId: string, status: string) {
    return this.prisma.complaint.update({
      where: { id: complaintId },
      data: { status }
    });
  }
}
