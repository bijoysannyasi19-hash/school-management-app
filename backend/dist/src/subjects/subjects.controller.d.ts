import { SubjectsService } from './subjects.service';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    getAllSubjects(classId?: string): Promise<({
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
        class: {
            id: string;
            name: string;
            section: string;
            teacherId: string | null;
        };
    } & {
        id: string;
        name: string;
        teacherId: string | null;
        classId: string;
        code: string;
    })[]>;
    createSubject(body: {
        name: string;
        code: string;
        classId: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        name: string;
        teacherId: string | null;
        classId: string;
        code: string;
    }>;
    updateSubject(id: string, body: {
        name: string;
        code: string;
        classId: string;
        teacherId?: string;
    }): Promise<{
        id: string;
        name: string;
        teacherId: string | null;
        classId: string;
        code: string;
    }>;
    deleteSubject(id: string): Promise<{
        id: string;
        name: string;
        teacherId: string | null;
        classId: string;
        code: string;
    }>;
}
