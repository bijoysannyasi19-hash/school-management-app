import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(req: any, body: {
        receiverId: string;
        content: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        read: boolean;
        senderId: string;
        receiverId: string;
    }>;
    getConversation(req: any, otherUserId: string): Promise<{
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
