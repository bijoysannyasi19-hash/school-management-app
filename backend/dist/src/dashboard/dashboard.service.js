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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStudentDashboard(userId) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
            include: {
                rewardPoints: true,
                classes: {
                    include: {
                        class: true
                    }
                },
                attendance: true,
            }
        });
        if (!student)
            return { error: 'Student not found' };
        const totalDays = student.attendance.length;
        const presentDays = student.attendance.filter(a => a.status === 'PRESENT').length;
        const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
        const totalRewardPoints = student.rewardPoints.reduce((sum, p) => sum + p.points, 0);
        const classIds = student.classes.map(sc => sc.classId);
        let pendingAssignments = 0;
        if (classIds.length > 0) {
            const classWorkspaces = await this.prisma.classWorkspace.findMany({
                where: { classId: { in: classIds } },
                include: { assignments: { include: { submissions: { where: { studentId: student.id } } } } }
            });
            classWorkspaces.forEach(cw => {
                cw.assignments.forEach(assignment => {
                    if (assignment.submissions.length === 0) {
                        pendingAssignments++;
                    }
                });
            });
        }
        const recentActivity = student.rewardPoints.slice(0, 5).map(p => ({
            id: p.id,
            action: `Received ${p.points} points for: ${p.reason}`,
            createdAt: p.awardedAt
        }));
        return {
            attendanceRate,
            totalRewardPoints,
            pendingAssignments,
            recentActivity
        };
    }
    async getTeacherDashboard(userId) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { userId },
            include: {
                classes: true,
                diaryEntries: true
            }
        });
        if (!teacher)
            return { error: 'Teacher not found' };
        const totalClasses = teacher.classes.length;
        let pendingGrading = 0;
        if (totalClasses > 0) {
            const workspaces = await this.prisma.classWorkspace.findMany({
                where: { classId: { in: teacher.classes.map(c => c.id) } },
                include: { assignments: { include: { submissions: { where: { grade: null } } } } }
            });
            workspaces.forEach(cw => {
                cw.assignments.forEach(assignment => {
                    pendingGrading += assignment.submissions.length;
                });
            });
        }
        const recentActivity = teacher.diaryEntries.slice(0, 5).map(d => ({
            id: d.id,
            action: `Wrote a diary entry`,
            createdAt: d.createdAt
        }));
        return {
            totalClasses,
            pendingGrading,
            recentActivity
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map