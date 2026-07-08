import { PrismaService } from '../prisma.service';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchUsers(query: string): Promise<({
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
    })[]>;
    searchStudents(query: string): Promise<({
        user: {
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
        userId: string;
        admissionNo: string;
        rollNo: string | null;
        bloodGroup: string | null;
        emergencyContact: string | null;
        parentId: string | null;
        hostelRoomId: string | null;
    })[]>;
}
