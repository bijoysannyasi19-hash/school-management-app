import { PrismaService } from '../prisma.service';
export declare class ComplaintsService {
    private prisma;
    constructor(prisma: PrismaService);
    submitComplaint(title: string, description: string, authorId: string | null): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        authorId: string | null;
        title: string;
    }>;
    getComplaints(userId?: string): Promise<({
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
    updateStatus(complaintId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        authorId: string | null;
        title: string;
    }>;
}
