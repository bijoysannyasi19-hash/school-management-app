import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DiscussionsService {
  constructor(private prisma: PrismaService) {}

  async createBoard(classId: string, title: string, description?: string) {
    return this.prisma.discussionBoard.create({
      data: { classId, title, description }
    });
  }

  async getBoardsByClass(classId: string) {
    return this.prisma.discussionBoard.findMany({
      where: { classId },
      include: {
        threads: {
          include: { author: { include: { profile: true } }, replies: { take: 1 } },
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      }
    });
  }

  async getThreadsByBoard(boardId: string) {
    return this.prisma.discussionThread.findMany({
      where: { boardId },
      include: { author: { include: { profile: true } }, replies: { take: 1 } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createThread(boardId: string, authorId: string, title: string, content: string) {
    return this.prisma.discussionThread.create({
      data: { boardId, authorId, title, content }
    });
  }

  async getThread(threadId: string) {
    return this.prisma.discussionThread.findUnique({
      where: { id: threadId },
      include: {
        author: { include: { profile: true } },
        replies: {
          include: { author: { include: { profile: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async replyToThread(threadId: string, authorId: string, content: string) {
    return this.prisma.threadReply.create({
      data: { threadId, authorId, content }
    });
  }
}
