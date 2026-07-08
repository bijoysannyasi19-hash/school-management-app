import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(title: string, description: string, date: Date, location: string, imageUrl?: string) {
    return this.prisma.event.create({
      data: { title, description, date, location, imageUrl }
    });
  }

  async registerForEvent(eventId: string, userId: string) {
    return this.prisma.eventRegistration.create({
      data: { eventId, userId, status: 'REGISTERED' }
    });
  }

  async getEvents() {
    return this.prisma.event.findMany({
      include: { registrations: true },
      orderBy: { date: 'asc' }
    });
  }
}
