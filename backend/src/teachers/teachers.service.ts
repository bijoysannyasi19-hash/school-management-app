import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.teacher.findMany({
      include: {
        user: {
          include: { profile: true }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: { include: { profile: true } }
      }
    });
  }

  async create(data: any) {
    const rawPassword = data.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const newTeacher = await this.prisma.teacher.create({
      data: {
        employeeId: data.employeeId,
        qualification: data.qualification,
        user: {
          create: {
            email: data.email,
            password: hashedPassword,
            role: 'TEACHER',
            profile: {
              create: {
                firstName: data.firstName,
                lastName: data.lastName,
              }
            }
          }
        }
      },
      include: {
        user: {
          include: { profile: true }
        }
      }
    });
    return { ...newTeacher, generatedPassword: data.password ? undefined : rawPassword };
  }

  async remove(id: string) {
    return this.prisma.teacher.delete({ where: { id } });
  }
}
