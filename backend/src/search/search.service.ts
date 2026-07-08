import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query } },
          { phone: { contains: query } },
          { profile: { firstName: { contains: query } } },
          { profile: { lastName: { contains: query } } }
        ]
      },
      include: { profile: true }
    });
  }

  async searchStudents(query: string) {
    return this.prisma.student.findMany({
      where: {
        OR: [
          { admissionNo: { contains: query } },
          { user: { profile: { firstName: { contains: query } } } }
        ]
      },
      include: { user: { include: { profile: true } } }
    });
  }
}
