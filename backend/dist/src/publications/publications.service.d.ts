import { PrismaService } from '../prisma.service';
export declare class PublicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPublication(title: string, issueDate: Date, type: string): Promise<{
        id: string;
        title: string;
        issueDate: Date;
        type: string;
    }>;
    addArticle(publicationId: string, title: string, content: string, authorName: string): Promise<{
        id: string;
        content: string;
        title: string;
        authorName: string;
        publicationId: string;
    }>;
    getPublications(): Promise<({
        articles: {
            id: string;
            content: string;
            title: string;
            authorName: string;
            publicationId: string;
        }[];
    } & {
        id: string;
        title: string;
        issueDate: Date;
        type: string;
    })[]>;
}
