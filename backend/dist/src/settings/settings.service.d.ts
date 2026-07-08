import { PrismaService } from '../prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        description: string | null;
    }[]>;
    updateSetting(key: string, value: string, description?: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        description: string | null;
    }>;
    getSettingByKey(key: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        description: string | null;
    } | null>;
}
