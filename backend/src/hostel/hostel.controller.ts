import { Controller, Get, Post, Body, Param, UseGuards, Put, Request } from '@nestjs/common';
import { HostelService } from './hostel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.HOSTEL_WARDEN)
  @Post('rooms')
  createRoom(@Body() body: { roomNumber: string; capacity: number }) {
    return this.hostelService.createRoom(body);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.HOSTEL_WARDEN)
  @Get('rooms')
  getAllRooms() {
    return this.hostelService.getAllRooms();
  }

  @Roles(Role.STUDENT)
  @Get('rooms/my')
  getMyRoom(@Request() req) {
    return this.hostelService.getMyRoom(req.user.userId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.HOSTEL_WARDEN)
  @Put('rooms/:roomId/allocate/:studentId')
  allocateRoom(@Param('roomId') roomId: string, @Param('studentId') studentId: string) {
    return this.hostelService.allocateRoom(roomId, studentId);
  }
}
