import { PortfolioService } from './portfolio.service';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    getMyPortfolio(req: any): Promise<{
        studentInfo: {
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
        admissionNo: string;
        achievements: {
            id: string;
            category: string;
            studentId: string;
            academicYear: string | null;
            description: string;
            title: string;
            dateEarned: Date;
        }[];
        badges: {
            id: string;
            name: string;
            iconUrl: string;
            studentId: string;
            awardedAt: Date;
        }[];
        totalRewardPoints: number;
        recentDiaryRemarks: {
            id: string;
            createdAt: Date;
            teacherId: string;
            studentId: string;
            content: string;
            type: string;
        }[];
    } | null>;
    getStudentPortfolio(studentId: string): Promise<{
        studentInfo: ({
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
        }) | undefined;
        admissionNo: string | undefined;
        achievements: {
            id: string;
            category: string;
            studentId: string;
            academicYear: string | null;
            description: string;
            title: string;
            dateEarned: Date;
        }[] | undefined;
        badges: {
            id: string;
            name: string;
            iconUrl: string;
            studentId: string;
            awardedAt: Date;
        }[] | undefined;
        totalRewardPoints: number;
        recentDiaryRemarks: {
            id: string;
            createdAt: Date;
            teacherId: string;
            studentId: string;
            content: string;
            type: string;
        }[] | undefined;
    }>;
}
