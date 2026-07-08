import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    findAll(): Promise<({
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
        parent: ({
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
            occupation: string | null;
            income: number | null;
        }) | null;
    } & {
        id: string;
        admissionNo: string;
        rollNo: string | null;
        bloodGroup: string | null;
        emergencyContact: string | null;
        userId: string;
        parentId: string | null;
        hostelRoomId: string | null;
    })[]>;
    findOne(id: string): Promise<({
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
        parent: {
            id: string;
            userId: string;
            occupation: string | null;
            income: number | null;
        } | null;
    } & {
        id: string;
        admissionNo: string;
        rollNo: string | null;
        bloodGroup: string | null;
        emergencyContact: string | null;
        userId: string;
        parentId: string | null;
        hostelRoomId: string | null;
    }) | null>;
    create(createStudentDto: any): Promise<{
        generatedPassword: any;
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
        id: string;
        admissionNo: string;
        rollNo: string | null;
        bloodGroup: string | null;
        emergencyContact: string | null;
        userId: string;
        parentId: string | null;
        hostelRoomId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        admissionNo: string;
        rollNo: string | null;
        bloodGroup: string | null;
        emergencyContact: string | null;
        userId: string;
        parentId: string | null;
        hostelRoomId: string | null;
    }>;
}
