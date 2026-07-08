import { PrismaService } from '../prisma.service';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    createEvent(title: string, description: string, date: Date, location: string, imageUrl?: string): Promise<{
        id: string;
        date: Date;
        description: string;
        title: string;
        location: string;
        imageUrl: string | null;
    }>;
    registerForEvent(eventId: string, userId: string): Promise<{
        id: string;
        userId: string;
        status: string;
        registeredAt: Date;
        eventId: string;
    }>;
    getEvents(): Promise<({
        registrations: {
            id: string;
            userId: string;
            status: string;
            registeredAt: Date;
            eventId: string;
        }[];
    } & {
        id: string;
        date: Date;
        description: string;
        title: string;
        location: string;
        imageUrl: string | null;
    })[]>;
}
