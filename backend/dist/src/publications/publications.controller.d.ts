import { PublicationsService } from './publications.service';
export declare class PublicationsController {
    private readonly publicationsService;
    constructor(publicationsService: PublicationsService);
    createPublication(body: {
        title: string;
        issueDate: string;
        type: string;
    }): Promise<{
        id: string;
        title: string;
        issueDate: Date;
        type: string;
    }>;
    addArticle(publicationId: string, body: {
        title: string;
        content: string;
        authorName: string;
    }): Promise<{
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
