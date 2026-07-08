import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

import { CreateEventDto } from './dto/create-event.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER)
  @Post()
  createEvent(@Body() body: CreateEventDto) {
    return this.eventsService.createEvent(body.title, body.description, new Date(body.date), body.location, body.imageUrl);
  }

  @Get()
  getEvents() {
    return this.eventsService.getEvents();
  }

  @Post(':eventId/register')
  registerForEvent(@Request() req, @Param('eventId') eventId: string) {
    return this.eventsService.registerForEvent(eventId, req.user.userId);
  }
}
