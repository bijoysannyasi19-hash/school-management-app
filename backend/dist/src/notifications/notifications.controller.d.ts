import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendNotification(body: {
        userId: string;
        title: string;
        body: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        read: boolean;
        body: string;
    }>;
    getMyNotifications(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        read: boolean;
        body: string;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        read: boolean;
        body: string;
    }>;
}
