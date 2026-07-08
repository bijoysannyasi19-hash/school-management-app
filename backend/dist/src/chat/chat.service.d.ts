import { PrismaService } from '../prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    sendMessage(senderId: string, receiverId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        read: boolean;
        senderId: string;
        receiverId: string;
    }>;
    getConversation(userId: string, otherUserId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        read: boolean;
        senderId: string;
        receiverId: string;
    }[]>;
    markAsRead(messageId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        read: boolean;
        senderId: string;
        receiverId: string;
    }>;
}
