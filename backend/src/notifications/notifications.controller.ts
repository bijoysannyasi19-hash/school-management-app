import { Controller, Get, Post, Body, Param, UseGuards, Put, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Post('send')
  sendNotification(@Body() body: { userId: string; title: string; body: string }) {
    return this.notificationsService.createNotification(body.userId, body.title, body.body);
  }

  @Get()
  getMyNotifications(@Request() req) {
    return this.notificationsService.getNotifications(req.user.userId);
  }

  @Put('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
