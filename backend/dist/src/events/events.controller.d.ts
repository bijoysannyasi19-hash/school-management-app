import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(body: CreateEventDto): Promise<{
        id: string;
        title: string;
        description: string;
        date: Date;
        location: string;
        imageUrl: string | null;
    }>;
    getEvents(): Promise<({
        registrations: {
            id: string;
            registeredAt: Date;
            status: string;
            eventId: string;
            userId: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        date: Date;
        location: string;
        imageUrl: string | null;
    })[]>;
    registerForEvent(req: any, eventId: string): Promise<{
        id: string;
        registeredAt: Date;
        status: string;
        eventId: string;
        userId: string;
    }>;
}
