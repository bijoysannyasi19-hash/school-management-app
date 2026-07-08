import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Post()
  createSurvey(@Body() body: { title: string; description?: string; questions?: any[] }) {
    return this.surveysService.createSurvey(body.title, body.description, body.questions);
  }

  @Get()
  getSurveys() {
    return this.surveysService.getSurveys();
  }

  @Post(':surveyId/response')
  submitResponse(
    @Request() req,
    @Param('surveyId') surveyId: string, 
    @Body() body: { answers: string; isAnonymous?: boolean }
  ) {
    const userId = body.isAnonymous ? null : req.user.userId;
    return this.surveysService.submitResponse(surveyId, userId, body.answers);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Get(':surveyId/responses')
  getSurveyResponses(@Param('surveyId') surveyId: string) {
    return this.surveysService.getSurveyResponses(surveyId);
  }
}
