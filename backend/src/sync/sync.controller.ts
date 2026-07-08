import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  getSyncData(@Request() req, @Query('lastSyncDate') lastSyncDate: string) {
    const date = lastSyncDate ? new Date(lastSyncDate) : new Date(0); // If none provided, fetch from epoch
    return this.syncService.getSyncData(req.user.userId, date);
  }
}
