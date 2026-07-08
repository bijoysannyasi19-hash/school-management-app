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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalStudents = await this.prisma.student.count();
        const totalTeachers = await this.prisma.teacher.count();
        const pendingInvoices = await this.prisma.feeInvoice.aggregate({
            where: { status: 'PENDING' },
            _sum: { amount: true }
        });
        const paidInvoices = await this.prisma.feeInvoice.aggregate({
            where: { status: 'PAID' },
            _sum: { amount: true }
        });
        return {
            totalStudents,
            totalTeachers,
            financials: {
                pending: pendingInvoices._sum.amount || 0,
                collected: paidInvoices._sum.amount || 0
            }
        };
    }
    async logAction(userId, action, entity, entityId, details) {
        return this.prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                details
            }
        });
    }
    async getAuditLogs() {
        return this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map