import { PrismaService } from '../prisma.service';
export declare class StoreService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(name: string, price: number, stock: number): Promise<{
        id: string;
        name: string;
        price: number;
        stock: number;
    }>;
    getProducts(): Promise<{
        id: string;
        name: string;
        price: number;
        stock: number;
    }[]>;
    placeOrder(userId: string, productId: string, quantity: number): Promise<{
        id: string;
        userId: string;
        status: string;
        quantity: number;
        totalPrice: number;
        orderDate: Date;
        productId: string;
    }>;
    getMyOrders(userId: string): Promise<({
        product: {
            id: string;
            name: string;
            price: number;
            stock: number;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        quantity: number;
        totalPrice: number;
        orderDate: Date;
        productId: string;
    })[]>;
    getAllOrders(): Promise<({
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
        product: {
            id: string;
            name: string;
            price: number;
            stock: number;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        quantity: number;
        totalPrice: number;
        orderDate: Date;
        productId: string;
    })[]>;
    updateOrderStatus(orderId: string, status: string): Promise<{
        id: string;
        userId: string;
        status: string;
        quantity: number;
        totalPrice: number;
        orderDate: Date;
        productId: string;
    }>;
}
