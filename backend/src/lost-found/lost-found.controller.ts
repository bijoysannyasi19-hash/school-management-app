import { Controller, Get, Post, Body, Param, UseGuards, Put, Request, Query } from '@nestjs/common';
import { LostFoundService } from './lost-found.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lost-found')
export class LostFoundController {
  constructor(private readonly lostFoundService: LostFoundService) {}

  @Post()
  reportItem(
    @Request() req,
    @Body() body: { type: string; itemName: string; description: string }
  ) {
    return this.lostFoundService.reportItem(req.user.userId, body.type, body.itemName, body.description);
  }

  @Get()
  getItems(@Query('status') status?: string, @Query('type') type?: string) {
    return this.lostFoundService.getItems(status, type);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Put(':id/status')
  updateItemStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.lostFoundService.updateItemStatus(id, status);
  }
}
