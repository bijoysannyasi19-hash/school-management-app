import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('users')
  searchUsers(@Query('q') query: string) {
    if (!query) return [];
    return this.searchService.searchUsers(query);
  }

  @Get('students')
  searchStudents(@Query('q') query: string) {
    if (!query) return [];
    return this.searchService.searchStudents(query);
  }
}
