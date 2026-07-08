"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let LibraryService = class LibraryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addBook(data) {
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
    async getMyIssues(userId) {
        return this.prisma.bookIssue.findMany({
            where: { userId },
            include: {
                book: true
            },
            orderBy: { issueDate: 'desc' }
        });
    }
    async issueBook(bookId, userId, dueDate) {
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book || book.available <= 0) {
            throw new common_1.BadRequestException('Book is not available');
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
    async returnBook(issueId) {
        const issue = await this.prisma.bookIssue.findUnique({ where: { id: issueId } });
        if (!issue || issue.returnDate) {
            throw new common_1.BadRequestException('Invalid issue record or already returned');
        }
        const now = new Date();
        let fine = 0;
        if (now > issue.dueDate) {
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
};
exports.LibraryService = LibraryService;
exports.LibraryService = LibraryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LibraryService);
//# sourceMappingURL=library.service.js.map