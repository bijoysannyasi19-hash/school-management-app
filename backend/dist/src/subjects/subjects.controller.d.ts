import { SubjectsService } from './subjects.service';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    getAllSubjects(classId?: string): Promise<({
        class: {
            id: string;
            name: string;
            teacherId: string | null;
            section: string;
        };
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
            employeeId: string;
            qualification: string | null;
            joiningDate: Date;
            userId: string;
        }) | null;
    } & {
        id: string;
        name: string;
        code: string;
        classId: string;
        teacherId: string | null;
    })[]>;
    createSubject(body: {
        name: string;
        code: string;
        classId: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        name: string;
        code: string;
        classId: string;
        teacherId: string | null;
    }>;
    updateSubject(id: string, body: {
        name: string;
        code: string;
        classId: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        name: string;
        code: string;
        classId: string;
        teacherId: string | null;
    }>;
    deleteSubject(id: string): Promise<{
        id: string;
        name: string;
        code: string;
        classId: string;
        teacherId: string | null;
    }>;
}
