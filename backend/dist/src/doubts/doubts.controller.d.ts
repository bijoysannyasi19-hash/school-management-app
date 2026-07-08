import { DoubtsService } from './doubts.service';
export declare class DoubtsController {
    private readonly doubtsService;
    constructor(doubtsService: DoubtsService);
    createDoubt(req: any, body: {
        subject: string;
        content: string;
        isUrgent?: boolean;
        taggedTeacherId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        content: string;
        subject: string;
        isUrgent: boolean;
        isResolved: boolean;
        taggedTeacherId: string | null;
    }>;
    getDoubts(subject?: string, isResolved?: string, isUrgent?: string, teacherId?: string): Promise<({
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
    replyToDoubt(req: any, id: string, body: {
        content: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        isAccepted: boolean;
        doubtId: string;
    }>;
    markResolved(id: string): Promise<{
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
