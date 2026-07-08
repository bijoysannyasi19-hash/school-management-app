import { VisitorsService } from './visitors.service';
export declare class VisitorsController {
    private readonly visitorsService;
    constructor(visitorsService: VisitorsService);
    checkInVisitor(body: {
        visitorName: string;
        purpose: string;
        hostId?: string;
    }): Promise<{
        id: string;
        visitorName: string;
        purpose: string;
        checkIn: Date;
        checkOut: Date | null;
        hostId: string | null;
    }>;
    getVisitors(activeOnly?: string): Promise<({
        host: ({
            profile: {
                id: string;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string | null;
                dob: Date | null;
                gender: string | null;
            } | null;
        } & {
            id: string;
            email: string | null;
            phone: string | null;
            password: string;
            role: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            lastLogin: Date | null;
        }) | null;
    } & {
        id: string;
        visitorName: string;
        purpose: string;
        checkIn: Date;
        checkOut: Date | null;
        hostId: string | null;
    })[]>;
    checkOutVisitor(id: string): Promise<{
        id: string;
        visitorName: string;
        purpose: string;
        checkIn: Date;
        checkOut: Date | null;
        hostId: string | null;
    }>;
}
