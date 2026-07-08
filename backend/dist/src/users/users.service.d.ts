import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneByEmail(email: string): Promise<({
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
        student: {
            id: string;
            userId: string;
            admissionNo: string;
            rollNo: string | null;
            bloodGroup: string | null;
            emergencyContact: string | null;
            parentId: string | null;
            hostelRoomId: string | null;
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
    }) | null>;
    findById(id: string): Promise<({
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
        student: {
            id: string;
            userId: string;
            admissionNo: string;
            rollNo: string | null;
            bloodGroup: string | null;
            emergencyContact: string | null;
            parentId: string | null;
            hostelRoomId: string | null;
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
    }) | null>;
    createUser(data: any): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        password: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLogin: Date | null;
    }>;
    setupInitialSuperAdmin(): Promise<void>;
    updateProfile(userId: string, data: {
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        avatarUrl?: string;
    }): Promise<{
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
    }>;
    updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
