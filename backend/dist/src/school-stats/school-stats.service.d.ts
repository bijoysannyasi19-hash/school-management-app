import { PrismaService } from '../prisma.service';
export declare class SchoolStatsService {
    private prisma;
    constructor(prisma: PrismaService);
    upsertCounter(key: string, label: string, value: number, iconUrl?: string, category?: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        label: string;
        value: number;
        iconUrl: string | null;
        category: string | null;
    }>;
    getAllCounters(): Promise<{
        key: string;
        label: string;
        value: number;
    }[]>;
    incrementCounter(key: string, amount?: number): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        label: string;
        value: number;
        iconUrl: string | null;
        category: string | null;
    }>;
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
}
