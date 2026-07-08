import { PrismaService } from '../prisma.service';
export declare class SyncService {
    private prisma;
    constructor(prisma: PrismaService);
    getSyncData(userId: string, lastSyncDate: Date): Promise<{
        timestamp: Date;
        alerts: {
            id: string;
            createdAt: Date;
            status: string;
            message: string;
            type: string;
            reportedBy: string;
        }[];
        events: {
            id: string;
            date: Date;
            description: string;
            title: string;
            location: string;
            imageUrl: string | null;
        }[];
    }>;
}
