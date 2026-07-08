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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async awardPoints(studentId, points, reason) {
        return this.prisma.rewardPoint.create({
            data: { studentId, points, reason }
        });
    }
    async getPoints(studentId) {
        const points = await this.prisma.rewardPoint.aggregate({
            where: { studentId },
            _sum: { points: true }
        });
        return points._sum.points || 0;
    }
    async getLeaderboard() {
        const points = await this.prisma.rewardPoint.groupBy({
            by: ['studentId'],
            _sum: { points: true },
            orderBy: { _sum: { points: 'desc' } },
            take: 10
        });
        const leaderboard = await Promise.all(points.map(async (p) => {
            const student = await this.prisma.student.findUnique({
                where: { id: p.studentId },
                include: { user: { include: { profile: true } } }
            });
            return {
                student,
                totalPoints: p._sum.points
            };
        }));
        return leaderboard;
    }
    async awardBadge(studentId, name, iconUrl) {
        return this.prisma.studentBadge.create({
            data: { studentId, name, iconUrl }
        });
    }
    async awardAchievement(studentId, title, category, description, academicYear) {
        return this.prisma.achievement.create({
            data: { studentId, title, category, description, academicYear }
        });
    }
    async getAchievementTimeline(studentId) {
        const achievements = await this.prisma.achievement.findMany({
            where: { studentId },
            orderBy: { dateEarned: 'desc' }
        });
        const timeline = achievements.reduce((acc, curr) => {
            const year = curr.academicYear || 'All-Time';
            if (!acc[year])
                acc[year] = [];
            acc[year].push(curr);
            return acc;
        }, {});
        return timeline;
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map