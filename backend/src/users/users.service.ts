import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ 
      where: { email },
      include: { student: true, profile: true } 
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ 
      where: { id },
      include: { student: true, profile: true }
    });
  }

  async createUser(data: any) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async setupInitialSuperAdmin() {
    const adminExists = await this.prisma.user.findFirst({
      where: { role: Role.SUPER_ADMIN },
    });
    if (!adminExists) {
      await this.createUser({
        email: 'admin@school.com',
        password: 'securePassword123',
        role: Role.SUPER_ADMIN,
      });
      console.log('Super Admin user created: admin@school.com');
    }
  }

  async updateProfile(userId: string, data: { firstName: string; lastName: string; email?: string; phone?: string; avatarUrl?: string }) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!user) throw new NotFoundException('User not found');

    // Update User level fields if provided
    if (data.email || data.phone) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.email && { email: data.email }),
          ...(data.phone && { phone: data.phone }),
        }
      });
    }

    // Update or create Profile
    if (user.profile) {
      return this.prisma.profile.update({
        where: { userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          avatarUrl: data.avatarUrl,
        }
      });
    } else {
      return this.prisma.profile.create({
        data: {
          userId,
          firstName: data.firstName,
          lastName: data.lastName,
          avatarUrl: data.avatarUrl,
        }
      });
    }
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { message: 'Password updated successfully' };
  }
}
