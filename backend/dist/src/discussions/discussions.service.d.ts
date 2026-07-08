import { PrismaService } from '../prisma.service';
export declare class DiscussionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createBoard(classId: string, title: string, description?: string): Promise<{
        id: string;
        classId: string;
        description: string | null;
        title: string;
    }>;
    getBoardsByClass(classId: string): Promise<({
        threads: ({
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
            replies: {
                id: string;
                createdAt: Date;
                content: string;
                authorId: string;
                threadId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            title: string;
            boardId: string;
        })[];
    } & {
        id: string;
        classId: string;
        description: string | null;
        title: string;
    })[]>;
    getThreadsByBoard(boardId: string): Promise<({
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
        replies: {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            threadId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        title: string;
        boardId: string;
    })[]>;
    createThread(boardId: string, authorId: string, title: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        title: string;
        boardId: string;
    }>;
    getThread(threadId: string): Promise<({
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
        replies: ({
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
        } & {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            threadId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        title: string;
        boardId: string;
    }) | null>;
    replyToThread(threadId: string, authorId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        threadId: string;
    }>;
}
