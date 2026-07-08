import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(classId: string, name: string, description?: string) {
    return this.prisma.classWorkspace.create({
      data: { classId, name, description }
    });
  }

  async getWorkspaceByClass(classId: string) {
    return this.prisma.classWorkspace.findUnique({
      where: { classId },
      include: {
        posts: {
          include: { author: { include: { profile: true } }, files: true },
          orderBy: { createdAt: 'desc' }
        },
        assignments: true
      }
    });
  }

  async createPost(workspaceId: string, authorId: string, content: string, isPinned: boolean = false) {
    return this.prisma.workspacePost.create({
      data: { workspaceId, authorId, content, isPinned }
    });
  }

  async createAssignment(workspaceId: string, title: string, description: string, dueDate: Date, attachmentUrl?: string) {
    return this.prisma.workspaceAssignment.create({
      data: {
        title,
        description,
        dueDate,
        attachmentUrl,
        workspaceId
      }
    });
  }

  async submitAssignment(assignmentId: string, userId: string, fileUrl: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId }
    });
    if (!student) {
      throw new Error('Student not found for this user');
    }

    return this.prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: student.id
        }
      },
      update: {
        fileUrl,
        submittedAt: new Date()
      },
      create: {
        assignmentId,
        studentId: student.id,
        fileUrl
      }
    });
  }

  async getSubmissions(assignmentId: string) {
    return this.prisma.assignmentSubmission.findMany({
      where: { assignmentId },
      include: {
        student: {
          include: { user: { include: { profile: true } } }
        }
      }
    });
  }
}
