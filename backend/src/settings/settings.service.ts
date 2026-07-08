import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    return this.prisma.systemSetting.findMany();
  }

  async updateSetting(key: string, value: string, description?: string) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description }
    });
  }

  async getSettingByKey(key: string) {
    return this.prisma.systemSetting.findUnique({ where: { key } });
  }
}
