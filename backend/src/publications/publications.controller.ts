import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Post()
  createPublication(@Body() body: { title: string; issueDate: string; type: string }) {
    return this.publicationsService.createPublication(body.title, new Date(body.issueDate), body.type);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Post(':id/article')
  addArticle(
    @Param('id') publicationId: string, 
    @Body() body: { title: string; content: string; authorName: string }
  ) {
    return this.publicationsService.addArticle(publicationId, body.title, body.content, body.authorName);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Get()
  getPublications() {
    return this.publicationsService.getPublications();
  }
}
