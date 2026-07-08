import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(): Promise<{
        totalStudents: number;
        totalTeachers: number;
        financials: {
            pending: number;
            collected: number;
        };
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
