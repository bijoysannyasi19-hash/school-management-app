import { Controller, Get, Post, Body, Param, UseGuards, Put, Request, Query } from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('doubts')
export class DoubtsController {
  constructor(private readonly doubtsService: DoubtsService) {}

  @Roles(Role.STUDENT)
  @Post()
  createDoubt(
    @Request() req,
    @Body() body: { subject: string; content: string; isUrgent?: boolean; taggedTeacherId?: string }
  ) {
    return this.doubtsService.createDoubt(
      req.user.userId,
      body.subject, 
      body.content, 
      body.isUrgent, 
      body.taggedTeacherId
    );
  }

  @Get()
  getDoubts(
    @Query('subject') subject?: string,
    @Query('isResolved') isResolved?: string,
    @Query('isUrgent') isUrgent?: string,
    @Query('teacherId') teacherId?: string
  ) {
    return this.doubtsService.getDoubts({
      subject,
      isResolved: isResolved !== undefined ? isResolved === 'true' : undefined,
      isUrgent: isUrgent !== undefined ? isUrgent === 'true' : undefined,
      teacherId
    });
  }

  @Post(':id/reply')
  replyToDoubt(@Request() req, @Param('id') id: string, @Body() body: { content: string }) {
    return this.doubtsService.replyToDoubt(id, req.user.userId, body.content);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT)
  @Put(':id/resolve')
  markResolved(@Param('id') id: string) {
    return this.doubtsService.markResolved(id);
  }
}
