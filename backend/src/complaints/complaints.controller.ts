import { Controller, Get, Post, Body, Param, UseGuards, Put, Request } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  submitComplaint(
    @Request() req,
    @Body() body: { title: string; description: string; isAnonymous?: boolean }
  ) {
    const authorId = body.isAnonymous ? null : req.user.userId;
    return this.complaintsService.submitComplaint(body.title, body.description, authorId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Get('all')
  getAllComplaints() {
    return this.complaintsService.getComplaints();
  }

  @Get('my')
  getMyComplaints(@Request() req) {
    return this.complaintsService.getComplaints(req.user.userId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.complaintsService.updateStatus(id, status);
  }
}
