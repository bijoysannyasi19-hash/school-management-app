import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async addBook(data: { title: string; author: string; isbn?: string; totalCopies: number; pdfUrl?: string }) {
    return this.prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        totalCopies: data.totalCopies,
        pdfUrl: data.pdfUrl,
        available: data.totalCopies
      }
    });
  }

  async getAllBooks() {
    return this.prisma.book.findMany();
  }

  async getAllIssues() {
    return this.prisma.bookIssue.findMany({
      include: {
        book: true,
        user: { include: { profile: true } }
      },
      orderBy: { issueDate: 'desc' }
    });
  }

  async getMyIssues(userId: string) {
    return this.prisma.bookIssue.findMany({
      where: { userId },
      include: {
        book: true
      },
      orderBy: { issueDate: 'desc' }
    });
  }

  async issueBook(bookId: string, userId: string, dueDate: Date) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.available <= 0) {
      throw new BadRequestException('Book is not available');
    }

    const issue = await this.prisma.bookIssue.create({
      data: {
        bookId,
        userId,
        dueDate
      }
    });

    await this.prisma.book.update({
      where: { id: bookId },
      data: { available: { decrement: 1 } }
    });

    return issue;
  }

  async returnBook(issueId: string) {
    const issue = await this.prisma.bookIssue.findUnique({ where: { id: issueId } });
    if (!issue || issue.returnDate) {
      throw new BadRequestException('Invalid issue record or already returned');
    }

    const now = new Date();
    let fine = 0;
    if (now > issue.dueDate) {
      // Calculate fine (e.g. 10 units per day late)
      const diffTime = Math.abs(now.getTime() - issue.dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      fine = diffDays * 10;
    }

    const updatedIssue = await this.prisma.bookIssue.update({
      where: { id: issueId },
      data: { returnDate: now, fine }
    });

    await this.prisma.book.update({
      where: { id: issue.bookId },
      data: { available: { increment: 1 } }
    });

    return updatedIssue;
  }
}
