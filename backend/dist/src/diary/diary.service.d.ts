import { PrismaService } from '../prisma.service';
export declare class DiaryService {
    private prisma;
    constructor(prisma: PrismaService);
    createEntry(studentId: string, userId: string, type: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        teacherId: string;
        studentId: string;
        content: string;
        type: string;
    }>;
    getStudentDiary(studentId: string): Promise<({
        teacher: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        teacherId: string;
        studentId: string;
        content: string;
        type: string;
    })[]>;
}
