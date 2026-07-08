import { ExamsService } from './exams.service';
export declare class ExamsController {
    private readonly examsService;
    constructor(examsService: ExamsService);
    createExam(body: {
        title: string;
        date: string;
        academicYear: string;
        classId: string;
    }): Promise<{
        id: string;
        classId: string;
        academicYear: string;
        date: Date;
        title: string;
    }>;
    getExamsByClass(classId: string): Promise<({
        results: {
            id: string;
            studentId: string;
            remarks: string | null;
            marksObtained: number;
            maxMarks: number;
            examId: string;
            subjectId: string;
        }[];
    } & {
        id: string;
        classId: string;
        academicYear: string;
        date: Date;
        title: string;
    })[]>;
    getExamResults(id: string): Promise<({
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
        subject: {
            id: string;
            name: string;
            teacherId: string | null;
            classId: string;
            code: string;
        };
    } & {
        id: string;
        studentId: string;
        remarks: string | null;
        marksObtained: number;
        maxMarks: number;
        examId: string;
        subjectId: string;
    })[]>;
    saveExamResults(id: string, body: {
        results: any[];
    }): Promise<any[]>;
    getStudentReportCard(studentId: string, academicYear: string): Promise<{
        student: ({
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
            classes: ({
                class: {
                    id: string;
                    name: string;
                    section: string;
                    teacherId: string | null;
                };
            } & {
                studentId: string;
                classId: string;
                academicYear: string;
            })[];
        } & {
            id: string;
            userId: string;
            admissionNo: string;
            rollNo: string | null;
            bloodGroup: string | null;
            emergencyContact: string | null;
            parentId: string | null;
            hostelRoomId: string | null;
        }) | null;
        results: ({
            subject: {
                id: string;
                name: string;
                teacherId: string | null;
                classId: string;
                code: string;
            };
            exam: {
                id: string;
                classId: string;
                academicYear: string;
                date: Date;
                title: string;
            };
        } & {
            id: string;
            studentId: string;
            remarks: string | null;
            marksObtained: number;
            maxMarks: number;
            examId: string;
            subjectId: string;
        })[];
        examRankings: {
            [key: string]: {
                rank: number;
                totalStudents: number;
            };
        };
    }>;
}
