import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post('board')
  createBoard(@Body() body: { classId: string; title: string; description?: string }) {
    return this.discussionsService.createBoard(body.classId, body.title, body.description);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT)
  @Get('class/:classId')
  getBoardsByClass(@Param('classId') classId: string) {
    return this.discussionsService.getBoardsByClass(classId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT)
  @Get('board/:boardId/threads')
  getThreadsByBoard(@Param('boardId') boardId: string) {
    return this.discussionsService.getThreadsByBoard(boardId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT)
  @Post('board/:boardId/thread')
  createThread(
    @Request() req,
    @Param('boardId') boardId: string, 
    @Body() body: { title: string; content: string }
  ) {
    return this.discussionsService.createThread(boardId, req.user.userId, body.title, body.content);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT)
  @Get('thread/:threadId')
  getThread(@Param('threadId') threadId: string) {
    return this.discussionsService.getThread(threadId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT)
  @Post('thread/:threadId/reply')
  replyToThread(
    @Request() req,
    @Param('threadId') threadId: string, 
    @Body() body: { content: string }
  ) {
    return this.discussionsService.replyToThread(threadId, req.user.userId, body.content);
  }
}
