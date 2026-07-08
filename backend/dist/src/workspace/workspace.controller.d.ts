import { WorkspaceService } from './workspace.service';
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    createWorkspace(body: {
        classId: string;
        name: string;
        description?: string;
    }): Promise<{
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
    createPost(req: any, workspaceId: string, body: {
        content: string;
        isPinned?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        isPinned: boolean;
        workspaceId: string;
        authorId: string;
    }>;
    createAssignment(workspaceId: string, body: {
        title: string;
        description: string;
        dueDate: string;
        attachmentUrl?: string;
    }, file?: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        workspaceId: string;
        title: string;
        dueDate: Date;
        attachmentUrl: string | null;
    }>;
    submitAssignment(req: any, assignmentId: string, body: {
        fileUrl?: string;
    }, file?: Express.Multer.File): Promise<{
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
