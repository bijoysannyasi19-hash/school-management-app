import { LostFoundService } from './lost-found.service';
export declare class LostFoundController {
    private readonly lostFoundService;
    constructor(lostFoundService: LostFoundService);
    reportItem(req: any, body: {
        type: string;
        itemName: string;
        description: string;
    }): Promise<{
        id: string;
        status: string;
        description: string;
        type: string;
        itemName: string;
        dateReported: Date;
        reporterId: string;
    }>;
    getItems(status?: string, type?: string): Promise<({
        reporter: {
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
        };
    } & {
        id: string;
        status: string;
        description: string;
        type: string;
        itemName: string;
        dateReported: Date;
        reporterId: string;
    })[]>;
    updateItemStatus(id: string, status: string): Promise<{
        id: string;
        status: string;
        description: string;
        type: string;
        itemName: string;
        dateReported: Date;
        reporterId: string;
    }>;
}
