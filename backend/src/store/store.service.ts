import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async createProduct(name: string, price: number, stock: number) {
    return this.prisma.storeProduct.create({
      data: { name, price, stock }
    });
  }

  async getProducts() {
    return this.prisma.storeProduct.findMany();
  }

  async placeOrder(userId: string, productId: string, quantity: number) {
    const product = await this.prisma.storeProduct.findUnique({ where: { id: productId } });
    if (!product || product.stock < quantity) throw new Error('Insufficient stock');

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

  async getMyOrders(userId: string) {
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

  async updateOrderStatus(orderId: string, status: string) {
    return this.prisma.storeOrder.update({
      where: { id: orderId },
      data: { status }
    });
  }
}
