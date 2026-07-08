import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        description: string | null;
    }[]>;
    getSettingByKey(key: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        description: string | null;
    } | null>;
    updateSetting(body: {
        key: string;
        value: string;
        description?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
        description: string | null;
    }>;
}
