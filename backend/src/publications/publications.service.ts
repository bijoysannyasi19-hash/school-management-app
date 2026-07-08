import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PublicationsService {
  constructor(private prisma: PrismaService) {}

  async createPublication(title: string, issueDate: Date, type: string) {
    return this.prisma.publication.create({
      data: { title, issueDate, type }
    });
  }

  async addArticle(publicationId: string, title: string, content: string, authorName: string) {
    return this.prisma.article.create({
      data: { publicationId, title, content, authorName }
    });
  }

  async getPublications() {
    return this.prisma.publication.findMany({
      include: { articles: true },
      orderBy: { issueDate: 'desc' }
    });
  }
}
