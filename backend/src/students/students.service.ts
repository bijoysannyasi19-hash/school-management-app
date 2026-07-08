import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.student.findMany({
      include: {
        user: {
          include: { profile: true }
        },
        parent: {
          include: { user: { include: { profile: true } } }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        user: { include: { profile: true } },
        parent: true
      }
    });
  }

  async create(data: any) {
    const rawPassword = data.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const newStudent = await this.prisma.student.create({
      data: {
        admissionNo: data.admissionNo,
        bloodGroup: data.bloodGroup,
        emergencyContact: data.emergencyContact,
        user: {
          create: {
            email: data.email,
            password: hashedPassword,
            role: 'STUDENT',
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
    return { ...newStudent, generatedPassword: data.password ? undefined : rawPassword };
  }

  async remove(id: string) {
    return this.prisma.student.delete({ where: { id } });
  }
}
