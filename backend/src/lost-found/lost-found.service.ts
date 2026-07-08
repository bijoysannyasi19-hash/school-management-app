import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LostFoundService {
  constructor(private prisma: PrismaService) {}

  async reportItem(reporterId: string, type: string, itemName: string, description: string) {
    return this.prisma.lostFoundItem.create({
      data: { reporterId, type, itemName, description, status: 'REPORTED' }
    });
  }

  async getItems(status?: string, type?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    return this.prisma.lostFoundItem.findMany({
      where,
      include: { reporter: { include: { profile: true } } },
      orderBy: { dateReported: 'desc' }
    });
  }

  async updateItemStatus(itemId: string, status: string) {
    return this.prisma.lostFoundItem.update({
      where: { id: itemId },
      data: { status }
    });
  }
}
