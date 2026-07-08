import { LibraryService } from './library.service';
export declare class LibraryController {
    private readonly libraryService;
    constructor(libraryService: LibraryService);
    addBook(body: {
        title: string;
        author: string;
        isbn?: string;
        totalCopies: number;
        pdfUrl?: string;
    }): Promise<{
        id: string;
        author: string;
        title: string;
        isbn: string | null;
        totalCopies: number;
        available: number;
        pdfUrl: string | null;
    }>;
    getAllBooks(): Promise<{
        id: string;
        author: string;
        title: string;
        isbn: string | null;
        totalCopies: number;
        available: number;
        pdfUrl: string | null;
    }[]>;
    getAllIssues(): Promise<({
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
        book: {
            id: string;
            author: string;
            title: string;
            isbn: string | null;
            totalCopies: number;
            available: number;
            pdfUrl: string | null;
        };
    } & {
        id: string;
        userId: string;
        dueDate: Date;
        issueDate: Date;
        returnDate: Date | null;
        fine: number;
        bookId: string;
    })[]>;
    getMyIssues(req: any): Promise<({
        book: {
            id: string;
            author: string;
            title: string;
            isbn: string | null;
            totalCopies: number;
            available: number;
            pdfUrl: string | null;
        };
    } & {
        id: string;
        userId: string;
        dueDate: Date;
        issueDate: Date;
        returnDate: Date | null;
        fine: number;
        bookId: string;
    })[]>;
    issueBook(body: {
        bookId: string;
        userId: string;
        dueDate: string;
    }): Promise<{
        id: string;
        userId: string;
        dueDate: Date;
        issueDate: Date;
        returnDate: Date | null;
        fine: number;
        bookId: string;
    }>;
    returnBook(issueId: string): Promise<{
        id: string;
        userId: string;
        dueDate: Date;
        issueDate: Date;
        returnDate: Date | null;
        fine: number;
        bookId: string;
    }>;
}
