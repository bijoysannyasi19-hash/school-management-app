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
exports.DiscussionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DiscussionsService = class DiscussionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBoard(classId, title, description) {
        return this.prisma.discussionBoard.create({
            data: { classId, title, description }
        });
    }
    async getBoardsByClass(classId) {
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
    async getThreadsByBoard(boardId) {
        return this.prisma.discussionThread.findMany({
            where: { boardId },
            include: { author: { include: { profile: true } }, replies: { take: 1 } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createThread(boardId, authorId, title, content) {
        return this.prisma.discussionThread.create({
            data: { boardId, authorId, title, content }
        });
    }
    async getThread(threadId) {
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
    async replyToThread(threadId, authorId, content) {
        return this.prisma.threadReply.create({
            data: { threadId, authorId, content }
        });
    }
};
exports.DiscussionsService = DiscussionsService;
exports.DiscussionsService = DiscussionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscussionsService);
//# sourceMappingURL=discussions.service.js.map