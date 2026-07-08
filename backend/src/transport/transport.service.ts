import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  async createRoute(data: { name: string; startPoint: string; endPoint: string }) {
    return this.prisma.transportRoute.create({ data });
  }

  async getAllRoutes() {
    return this.prisma.transportRoute.findMany({
      include: {
        vehicles: {
          include: { driver: { include: { profile: true } } }
        }
      }
    });
  }

  async addVehicle(data: { number: string; capacity: number; routeId?: string; driverId?: string }) {
    return this.prisma.vehicle.create({ data });
  }

  async getAllVehicles() {
    return this.prisma.vehicle.findMany({
      include: {
        route: true,
        driver: { include: { profile: true } }
      }
    });
  }
}
