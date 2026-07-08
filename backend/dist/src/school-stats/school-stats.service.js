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
exports.SchoolStatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SchoolStatsService = class SchoolStatsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertCounter(key, label, value, iconUrl, category) {
        return this.prisma.schoolDashboardCounter.upsert({
            where: { key },
            update: { label, value, iconUrl, category },
            create: { key, label, value, iconUrl, category }
        });
    }
    async getAllCounters() {
        const totalStudents = await this.prisma.student.count();
        const totalTeachers = await this.prisma.teacher.count();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const presentCount = await this.prisma.attendance.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow
                },
                status: 'PRESENT'
            }
        });
        const attendanceRate = totalStudents > 0
            ? Math.round((presentCount / totalStudents) * 100)
            : 0;
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const paymentsThisMonth = await this.prisma.feePayment.findMany({
            where: {
                date: {
                    gte: firstDayOfMonth
                }
            }
        });
        const monthlyRevenue = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
        return [
            { key: 'total_students', label: 'Total Students', value: totalStudents },
            { key: 'total_teachers', label: 'Total Teachers', value: totalTeachers },
            { key: 'attendance_rate', label: 'Attendance Rate', value: attendanceRate },
            { key: 'monthly_revenue', label: 'Monthly Revenue', value: monthlyRevenue }
        ];
    }
    async incrementCounter(key, amount = 1) {
        return this.prisma.schoolDashboardCounter.update({
            where: { key },
            data: { value: { increment: amount } }
        });
    }
    async getChartData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((month, index) => ({
            name: month,
            revenue: 50000 + Math.random() * 50000 + (index * 10000),
        }));
    }
    async getRecentActivity() {
        const activities = await this.prisma.auditLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });
        if (activities.length > 0) {
            return activities;
        }
        return [
            { id: '1', action: 'Created new class 10A', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
            { id: '2', action: 'Fee payment received from Student #1042', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
            { id: '3', action: 'Published new notice regarding exams', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
            { id: '4', action: 'Added 5 new books to library', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        ];
    }
};
exports.SchoolStatsService = SchoolStatsService;
exports.SchoolStatsService = SchoolStatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchoolStatsService);
//# sourceMappingURL=school-stats.service.js.map