import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Post('product')
  createProduct(@Body() body: { name: string; price: number; stock: number }) {
    return this.storeService.createProduct(body.name, body.price, body.stock);
  }

  @Get('products')
  getProducts() {
    return this.storeService.getProducts();
  }

  @Post('order')
  placeOrder(@Request() req, @Body() body: { productId: string; quantity: number }) {
    return this.storeService.placeOrder(req.user.userId, body.productId, body.quantity);
  }

  @Get('my-orders')
  getMyOrders(@Request() req) {
    return this.storeService.getMyOrders(req.user.userId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Get('orders')
  getAllOrders() {
    return this.storeService.getAllOrders();
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Put('order/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.storeService.updateOrderStatus(id, body.status);
  }
}
