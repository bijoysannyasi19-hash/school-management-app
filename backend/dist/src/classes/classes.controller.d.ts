import { ClassesService } from './classes.service';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    findAll(): Promise<({
        subjects: {
            id: string;
            name: string;
            teacherId: string | null;
            classId: string;
            code: string;
        }[];
        classTeacher: ({
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
        students: ({
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
        } & {
            studentId: string;
            classId: string;
            academicYear: string;
        })[];
    } & {
        id: string;
        name: string;
        section: string;
        teacherId: string | null;
    })[]>;
    findOne(id: string): Promise<({
        subjects: ({
            teacher: {
                id: string;
                userId: string;
                employeeId: string;
                qualification: string | null;
                joiningDate: Date;
            } | null;
        } & {
            id: string;
            name: string;
            teacherId: string | null;
            classId: string;
            code: string;
        })[];
        classTeacher: {
            id: string;
            userId: string;
            employeeId: string;
            qualification: string | null;
            joiningDate: Date;
        } | null;
        students: ({
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
        } & {
            studentId: string;
            classId: string;
            academicYear: string;
        })[];
    } & {
        id: string;
        name: string;
        section: string;
        teacherId: string | null;
    }) | null>;
    getStudentsByClass(id: string): Promise<({
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
    create(body: {
        name: string;
        section: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        name: string;
        section: string;
        teacherId: string | null;
    }>;
    assignStudent(classId: string, body: {
        studentId: string;
        academicYear: string;
    }): Promise<{
        studentId: string;
        classId: string;
        academicYear: string;
    }>;
    addSubject(classId: string, body: {
        name: string;
        code: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        name: string;
        teacherId: string | null;
        classId: string;
        code: string;
    }>;
}
