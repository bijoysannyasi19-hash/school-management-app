import { PrismaService } from '../prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStudentDashboard(userId: string): Promise<{
        error: string;
        attendanceRate?: undefined;
        totalRewardPoints?: undefined;
        pendingAssignments?: undefined;
        recentActivity?: undefined;
    } | {
        attendanceRate: number;
        totalRewardPoints: number;
        pendingAssignments: number;
        recentActivity: {
            id: string;
            action: string;
            createdAt: Date;
        }[];
        error?: undefined;
    }>;
    getTeacherDashboard(userId: string): Promise<{
        error: string;
        totalClasses?: undefined;
        pendingGrading?: undefined;
        recentActivity?: undefined;
    } | {
        totalClasses: number;
        pendingGrading: number;
        recentActivity: {
            id: string;
            action: string;
            createdAt: Date;
        }[];
        error?: undefined;
    }>;
}
