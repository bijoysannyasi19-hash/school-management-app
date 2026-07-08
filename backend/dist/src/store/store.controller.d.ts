import { StoreService } from './store.service';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    createProduct(body: {
        name: string;
        price: number;
        stock: number;
    }): Promise<{
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
    placeOrder(req: any, body: {
        productId: string;
        quantity: number;
    }): Promise<{
        id: string;
        userId: string;
        status: string;
        quantity: number;
        totalPrice: number;
        orderDate: Date;
        productId: string;
    }>;
    getMyOrders(req: any): Promise<({
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
    updateOrderStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        userId: string;
        status: string;
        quantity: number;
        totalPrice: number;
        orderDate: Date;
        productId: string;
    }>;
}
