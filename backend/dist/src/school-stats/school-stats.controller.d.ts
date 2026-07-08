import { SchoolStatsService } from './school-stats.service';
export declare class SchoolStatsController {
    private readonly schoolStatsService;
    constructor(schoolStatsService: SchoolStatsService);
    getAllCounters(): Promise<{
        key: string;
        label: string;
        value: number;
    }[]>;
    getChartData(): Promise<{
        name: string;
        revenue: number;
    }[]>;
    getRecentActivity(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        details: string | null;
    }[] | {
        id: string;
        action: string;
        createdAt: string;
    }[]>;
    upsertCounter(body: {
        key: string;
        label: string;
        value: number;
        iconUrl?: string;
        category?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        label: string;
        value: number;
        iconUrl: string | null;
        category: string | null;
    }>;
    incrementCounter(key: string, amount?: number): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        label: string;
        value: number;
        iconUrl: string | null;
        category: string | null;
    }>;
}
