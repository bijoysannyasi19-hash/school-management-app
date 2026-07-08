import { ComplaintsService } from './complaints.service';
export declare class ComplaintsController {
    private readonly complaintsService;
    constructor(complaintsService: ComplaintsService);
    submitComplaint(req: any, body: {
        title: string;
        description: string;
        isAnonymous?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        authorId: string | null;
        title: string;
    }>;
    getAllComplaints(): Promise<({
        author: ({
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
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        authorId: string | null;
        title: string;
    })[]>;
    getMyComplaints(req: any): Promise<({
        author: ({
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
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        authorId: string | null;
        title: string;
    })[]>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        authorId: string | null;
        title: string;
    }>;
}
