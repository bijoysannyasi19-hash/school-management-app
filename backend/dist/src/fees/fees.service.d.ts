import { PrismaService } from '../prisma.service';
export declare class FeesService {
    private prisma;
    constructor(prisma: PrismaService);
    createInvoice(data: {
        studentId: string;
        amount: number;
        dueDate: Date;
        description: string;
    }): Promise<{
        id: string;
        studentId: string;
        status: string;
        description: string;
        dueDate: Date;
        amount: number;
    }>;
    getStudentInvoices(studentId: string): Promise<({
        payments: {
            id: string;
            date: Date;
            amount: number;
            method: string;
            reference: string | null;
            invoiceId: string;
        }[];
    } & {
        id: string;
        studentId: string;
        status: string;
        description: string;
        dueDate: Date;
        amount: number;
    })[]>;
    getAllInvoices(): Promise<({
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
        payments: {
            id: string;
            date: Date;
            amount: number;
            method: string;
            reference: string | null;
            invoiceId: string;
        }[];
    } & {
        id: string;
        studentId: string;
        status: string;
        description: string;
        dueDate: Date;
        amount: number;
    })[]>;
    recordPayment(invoiceId: string, amount: number, method: string, reference?: string): Promise<{
        id: string;
        date: Date;
        amount: number;
        method: string;
        reference: string | null;
        invoiceId: string;
    }>;
}
