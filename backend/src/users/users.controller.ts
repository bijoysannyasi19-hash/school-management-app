import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  updateProfile(@Request() req, @Body() body: { firstName: string; lastName: string; email?: string; phone?: string; avatarUrl?: string }) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @Put('password')
  updatePassword(@Request() req, @Body() body: { currentPassword: string; newPassword: string }) {
    return this.usersService.updatePassword(req.user.userId, body.currentPassword, body.newPassword);
  }
}
