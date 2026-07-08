import { PrismaService } from '../prisma.service';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    markAttendance(studentId: string, date: Date, status: string, remarks?: string): Promise<{
        id: string;
        studentId: string;
        date: Date;
        status: string;
        remarks: string | null;
    }>;
    bulkMarkAttendance(records: {
        studentId: string;
        date: Date;
        status: string;
        remarks?: string;
    }[]): Promise<any[]>;
    getAttendanceByStudent(studentId: string, startDate: Date, endDate: Date): Promise<{
        id: string;
        studentId: string;
        date: Date;
        status: string;
        remarks: string | null;
    }[]>;
    getAttendanceByClass(classId: string, date: Date): Promise<({
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
            attendance: {
                id: string;
                studentId: string;
                date: Date;
                status: string;
                remarks: string | null;
            }[];
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
    } & {
        studentId: string;
        classId: string;
        academicYear: string;
    })[]>;
}
