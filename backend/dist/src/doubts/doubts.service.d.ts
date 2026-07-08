import { PrismaService } from '../prisma.service';
export declare class DoubtsService {
    private prisma;
    constructor(prisma: PrismaService);
    createDoubt(userId: string, subject: string, content: string, isUrgent?: boolean, taggedTeacherId?: string): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        content: string;
        subject: string;
        isUrgent: boolean;
        isResolved: boolean;
        taggedTeacherId: string | null;
    }>;
    getDoubts(filters: {
        subject?: string;
        isResolved?: boolean;
        isUrgent?: boolean;
        teacherId?: string;
    }): Promise<({
        student: {
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
        };
        taggedTeacher: ({
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
            employeeId: string;
            qualification: string | null;
            joiningDate: Date;
        }) | null;
        replies: ({
            author: {
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
            createdAt: Date;
            content: string;
            authorId: string;
            isAccepted: boolean;
            doubtId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        studentId: string;
        content: string;
        subject: string;
        isUrgent: boolean;
        isResolved: boolean;
        taggedTeacherId: string | null;
    })[]>;
    replyToDoubt(doubtId: string, authorId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        isAccepted: boolean;
        doubtId: string;
    }>;
    markResolved(doubtId: string): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        content: string;
        subject: string;
        isUrgent: boolean;
        isResolved: boolean;
        taggedTeacherId: string | null;
    }>;
}
