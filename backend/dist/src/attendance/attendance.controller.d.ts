import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markAttendance(body: {
        studentId: string;
        date: string;
        status: string;
        remarks?: string;
    }): Promise<{
        id: string;
        studentId: string;
        date: Date;
        status: string;
        remarks: string | null;
    }>;
    bulkMarkAttendance(body: {
        records: {
            studentId: string;
            date: string;
            status: string;
            remarks?: string;
        }[];
    }): Promise<any[]>;
    getStudentAttendance(studentId: string, startDate: string, endDate: string): Promise<{
        id: string;
        studentId: string;
        date: Date;
        status: string;
        remarks: string | null;
    }[]>;
    getClassAttendance(classId: string, date: string): Promise<({
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
