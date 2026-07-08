import { SyncService } from './sync.service';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    getSyncData(req: any, lastSyncDate: string): Promise<{
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
