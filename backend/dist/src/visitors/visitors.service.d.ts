import { PrismaService } from '../prisma.service';
export declare class VisitorsService {
    private prisma;
    constructor(prisma: PrismaService);
    checkInVisitor(visitorName: string, purpose: string, hostId?: string): Promise<{
        id: string;
        visitorName: string;
        purpose: string;
        checkIn: Date;
        checkOut: Date | null;
        hostId: string | null;
    }>;
    checkOutVisitor(passId: string): Promise<{
        id: string;
        visitorName: string;
        purpose: string;
        checkIn: Date;
        checkOut: Date | null;
        hostId: string | null;
    }>;
    getVisitors(includeCheckedOut?: boolean): Promise<({
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
}
