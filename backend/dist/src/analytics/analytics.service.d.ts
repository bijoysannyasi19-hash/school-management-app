import { PrismaService } from '../prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalStudents: number;
        totalTeachers: number;
        financials: {
            pending: number;
            collected: number;
        };
    }>;
    logAction(userId: string, action: string, entity: string, entityId?: string, details?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        details: string | null;
    }>;
    getAuditLogs(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        details: string | null;
    }[]>;
}
