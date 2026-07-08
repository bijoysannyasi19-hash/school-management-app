import { PrismaService } from '../prisma.service';
export declare class TransportService {
    private prisma;
    constructor(prisma: PrismaService);
    createRoute(data: {
        name: string;
        startPoint: string;
        endPoint: string;
    }): Promise<{
        id: string;
        name: string;
        startPoint: string;
        endPoint: string;
    }>;
    getAllRoutes(): Promise<({
        vehicles: ({
            driver: ({
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
            number: string;
            id: string;
            capacity: number;
            routeId: string | null;
            driverId: string | null;
        })[];
    } & {
        id: string;
        name: string;
        startPoint: string;
        endPoint: string;
    })[]>;
    addVehicle(data: {
        number: string;
        capacity: number;
        routeId?: string;
        driverId?: string;
    }): Promise<{
        number: string;
        id: string;
        capacity: number;
        routeId: string | null;
        driverId: string | null;
    }>;
    getAllVehicles(): Promise<({
        route: {
            id: string;
            name: string;
            startPoint: string;
            endPoint: string;
        } | null;
        driver: ({
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
        number: string;
        id: string;
        capacity: number;
        routeId: string | null;
        driverId: string | null;
    })[]>;
}
