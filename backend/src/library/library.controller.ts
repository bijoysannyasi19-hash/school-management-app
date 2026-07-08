import { Controller, Get, Post, Body, Param, UseGuards, Put, Request } from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.LIBRARIAN)
  @Post('books')
  addBook(@Body() body: { title: string; author: string; isbn?: string; totalCopies: number; pdfUrl?: string }) {
    return this.libraryService.addBook(body);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.LIBRARIAN, Role.TEACHER, Role.STUDENT)
  @Get('books')
  getAllBooks() {
    return this.libraryService.getAllBooks();
  }
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.LIBRARIAN)
  @Get('issues')
  getAllIssues() {
    return this.libraryService.getAllIssues();
  }

  @Get('my-issues')
  getMyIssues(@Request() req) {
    return this.libraryService.getMyIssues(req.user.userId);
  }
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.LIBRARIAN)
  @Post('issue')
  issueBook(@Body() body: { bookId: string; userId: string; dueDate: string }) {
    return this.libraryService.issueBook(body.bookId, body.userId, new Date(body.dueDate));
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.LIBRARIAN)
  @Put('return/:issueId')
  returnBook(@Param('issueId') issueId: string) {
    return this.libraryService.returnBook(issueId);
  }
}
