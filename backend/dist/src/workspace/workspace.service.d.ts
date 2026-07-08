import { PrismaService } from '../prisma.service';
export declare class WorkspaceService {
    private prisma;
    constructor(prisma: PrismaService);
    createWorkspace(classId: string, name: string, description?: string): Promise<{
        id: string;
        name: string;
        classId: string;
        description: string | null;
    }>;
    getWorkspaceByClass(classId: string): Promise<({
        posts: ({
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
            files: {
                id: string;
                fileUrl: string;
                fileName: string;
                postId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            content: string;
            isPinned: boolean;
            workspaceId: string;
            authorId: string;
        })[];
        assignments: {
            id: string;
            createdAt: Date;
            description: string;
            workspaceId: string;
            title: string;
            dueDate: Date;
            attachmentUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        classId: string;
        description: string | null;
    }) | null>;
    createPost(workspaceId: string, authorId: string, content: string, isPinned?: boolean): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        isPinned: boolean;
        workspaceId: string;
        authorId: string;
    }>;
    createAssignment(workspaceId: string, title: string, description: string, dueDate: Date, attachmentUrl?: string): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        workspaceId: string;
        title: string;
        dueDate: Date;
        attachmentUrl: string | null;
    }>;
    submitAssignment(assignmentId: string, userId: string, fileUrl: string): Promise<{
        id: string;
        studentId: string;
        fileUrl: string;
        submittedAt: Date;
        grade: string | null;
        feedback: string | null;
        assignmentId: string;
    }>;
    getSubmissions(assignmentId: string): Promise<({
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
        id: string;
        studentId: string;
        fileUrl: string;
        submittedAt: Date;
        grade: string | null;
        feedback: string | null;
        assignmentId: string;
    })[]>;
}
