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
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PortfolioService = class PortfolioService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStudentPortfolio(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                user: { include: { profile: true } },
                achievements: true,
                badges: true,
                rewardPoints: true,
                diaryEntries: { orderBy: { createdAt: 'desc' }, take: 10 }
            }
        });
        const totalPoints = student?.rewardPoints.reduce((sum, p) => sum + p.points, 0) || 0;
        return {
            studentInfo: student?.user,
            admissionNo: student?.admissionNo,
            achievements: student?.achievements,
            badges: student?.badges,
            totalRewardPoints: totalPoints,
            recentDiaryRemarks: student?.diaryEntries
        };
    }
    async getMyPortfolio(userId) {
        const student = await this.prisma.student.findUnique({
            where: { userId: userId },
            include: {
                user: { include: { profile: true } },
                achievements: true,
                badges: true,
                rewardPoints: true,
                diaryEntries: { orderBy: { createdAt: 'desc' }, take: 10 }
            }
        });
        if (!student)
            return null;
        const totalPoints = student.rewardPoints.reduce((sum, p) => sum + p.points, 0);
        return {
            studentInfo: student.user,
            admissionNo: student.admissionNo,
            achievements: student.achievements,
            badges: student.badges,
            totalRewardPoints: totalPoints,
            recentDiaryRemarks: student.diaryEntries
        };
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map