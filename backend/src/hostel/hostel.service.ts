import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HostelService {
  constructor(private prisma: PrismaService) {}

  async createRoom(data: { roomNumber: string; capacity: number }) {
    return this.prisma.hostelRoom.create({ data });
  }

  async getAllRooms() {
    return this.prisma.hostelRoom.findMany({
      include: {
        students: {
          include: { user: { include: { profile: true } } }
        }
      }
    });
  }

  async getMyRoom(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { hostelRoom: true }
    });
    if (!student || !student.hostelRoom) {
      throw new BadRequestException('No room assigned');
    }
    return student.hostelRoom;
  }

  async allocateRoom(roomId: string, studentId: string) {
    const room = await this.prisma.hostelRoom.findUnique({ where: { id: roomId } });
    if (!room || room.occupied >= room.capacity) {
      throw new BadRequestException('Room is full or does not exist');
    }

    const student = await this.prisma.student.update({
      where: { id: studentId },
      data: { hostelRoomId: roomId }
    });

    await this.prisma.hostelRoom.update({
      where: { id: roomId },
      data: { occupied: { increment: 1 } }
    });

    return student;
  }
}
