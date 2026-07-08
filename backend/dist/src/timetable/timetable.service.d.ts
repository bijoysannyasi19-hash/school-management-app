import { PrismaService } from '../prisma.service';
export declare class TimetableService {
    private prisma;
    constructor(prisma: PrismaService);
    getClassTimetable(classId: string): Promise<({
        teacher: ({
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
        subject: {
            id: string;
            name: string;
            teacherId: string | null;
            classId: string;
            code: string;
        };
    } & {
        id: string;
        teacherId: string | null;
        classId: string;
        subjectId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    })[]>;
    addPeriod(classId: string, dayOfWeek: number, startTime: string, endTime: string, subjectId: string, teacherId?: string): Promise<{
        teacher: ({
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
        subject: {
            id: string;
            name: string;
            teacherId: string | null;
            classId: string;
            code: string;
        };
    } & {
        id: string;
        teacherId: string | null;
        classId: string;
        subjectId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }>;
    deletePeriod(id: string): Promise<{
        id: string;
        teacherId: string | null;
        classId: string;
        subjectId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }>;
}
