import { PrismaService } from '../prisma.service';
export declare class SafetyService {
    private prisma;
    constructor(prisma: PrismaService);
    triggerEmergencyAlert(reportedBy: string, type: string, message: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        message: string;
        type: string;
        reportedBy: string;
    }>;
    getActiveAlerts(): Promise<({
        reporter: {
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
        status: string;
        message: string;
        type: string;
        reportedBy: string;
    })[]>;
    resolveAlert(alertId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        message: string;
        type: string;
        reportedBy: string;
    }>;
    submitIncidentReport(reportedBy: string, title: string, description: string): Promise<{
        id: string;
        date: Date;
        description: string;
        title: string;
        reportedBy: string;
    }>;
    getIncidentReports(): Promise<({
        reporter: {
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
        date: Date;
        description: string;
        title: string;
        reportedBy: string;
    })[]>;
}
