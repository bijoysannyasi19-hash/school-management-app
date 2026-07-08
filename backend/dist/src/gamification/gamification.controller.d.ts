import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    awardPoints(body: {
        studentId: string;
        points: number;
        reason: string;
    }): Promise<{
        id: string;
        studentId: string;
        points: number;
        reason: string;
        awardedAt: Date;
    }>;
    getLeaderboard(): Promise<{
        student: ({
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
        }) | null;
        totalPoints: number | null;
    }[]>;
    awardBadge(body: {
        studentId: string;
        name: string;
        iconUrl: string;
    }): Promise<{
        id: string;
        name: string;
        iconUrl: string;
        studentId: string;
        awardedAt: Date;
    }>;
    awardAchievement(body: {
        studentId: string;
        title: string;
        category: string;
        description: string;
        academicYear?: string;
    }): Promise<{
        id: string;
        category: string;
        studentId: string;
        academicYear: string | null;
        description: string;
        title: string;
        dateEarned: Date;
    }>;
    getAchievementTimeline(studentId: string): Promise<Record<string, any[]>>;
}
