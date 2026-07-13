import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(body: CreateEventDto): Promise<{
        id: string;
        date: Date;
        description: string;
        title: string;
        location: string;
        imageUrl: string | null;
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
    registerForEvent(req: any, eventId: string): Promise<{
        id: string;
        userId: string;
        status: string;
        registeredAt: Date;
        eventId: string;
    }>;
}
