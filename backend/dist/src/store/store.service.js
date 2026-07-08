"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let StoreService = class StoreService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(name, price, stock) {
        return this.prisma.storeProduct.create({
            data: { name, price, stock }
        });
    }
    async getProducts() {
        return this.prisma.storeProduct.findMany();
    }
    async placeOrder(userId, productId, quantity) {
        const product = await this.prisma.storeProduct.findUnique({ where: { id: productId } });
        if (!product || product.stock < quantity)
            throw new Error('Insufficient stock');
        const totalPrice = product.price * quantity;
        const order = await this.prisma.storeOrder.create({
            data: { userId, productId, quantity, totalPrice, status: 'PENDING' }
        });
        await this.prisma.storeProduct.update({
            where: { id: productId },
            data: { stock: product.stock - quantity }
        });
        return order;
    }
    async getMyOrders(userId) {
        return this.prisma.storeOrder.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { orderDate: 'desc' }
        });
    }
    async getAllOrders() {
        return this.prisma.storeOrder.findMany({
            include: { product: true, user: { include: { profile: true } } },
            orderBy: { orderDate: 'desc' }
        });
    }
    async updateOrderStatus(orderId, status) {
        return this.prisma.storeOrder.update({
            where: { id: orderId },
            data: { status }
        });
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoreService);
//# sourceMappingURL=store.service.js.map