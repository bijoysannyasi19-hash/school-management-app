import { Controller, Get, Post, Body, Param, UseGuards, Put, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(@Request() req, @Body() body: { receiverId: string; content: string }) {
    // Assuming req.user is set by JwtAuthGuard
    return this.chatService.sendMessage(req.user.userId, body.receiverId, body.content);
  }

  @Get('conversation/:userId')
  getConversation(@Request() req, @Param('userId') otherUserId: string) {
    return this.chatService.getConversation(req.user.userId, otherUserId);
  }

  @Put('read/:messageId')
  markAsRead(@Param('messageId') messageId: string) {
    return this.chatService.markAsRead(messageId);
  }
}
