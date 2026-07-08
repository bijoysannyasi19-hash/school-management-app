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
exports.DoubtsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DoubtsService = class DoubtsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDoubt(userId, subject, content, isUrgent = false, taggedTeacherId) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            throw new Error('Student not found for this user');
        return this.prisma.doubt.create({
            data: { studentId: student.id, subject, content, isUrgent, taggedTeacherId }
        });
    }
    async getDoubts(filters) {
        const where = {};
        if (filters.subject)
            where.subject = filters.subject;
        if (filters.isResolved !== undefined)
            where.isResolved = filters.isResolved;
        if (filters.isUrgent !== undefined)
            where.isUrgent = filters.isUrgent;
        if (filters.teacherId)
            where.taggedTeacherId = filters.teacherId;
        return this.prisma.doubt.findMany({
            where,
            include: {
                student: { include: { user: { include: { profile: true } } } },
                taggedTeacher: { include: { user: { include: { profile: true } } } },
                replies: {
                    include: { author: { include: { profile: true } } },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }]
        });
    }
    async replyToDoubt(doubtId, authorId, content) {
        return this.prisma.doubtReply.create({
            data: { doubtId, authorId, content }
        });
    }
    async markResolved(doubtId) {
        return this.prisma.doubt.update({
            where: { id: doubtId },
            data: { isResolved: true }
        });
    }
};
exports.DoubtsService = DoubtsService;
exports.DoubtsService = DoubtsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoubtsService);
//# sourceMappingURL=doubts.service.js.map