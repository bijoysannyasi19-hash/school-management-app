import { PrismaService } from '../prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    createNotification(userId: string, title: string, body: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        read: boolean;
        body: string;
    }>;
    getNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        read: boolean;
        body: string;
    }[]>;
    markAsRead(notificationId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        read: boolean;
        body: string;
    }>;
}
