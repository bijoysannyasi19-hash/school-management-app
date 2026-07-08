import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) {}

  async createSurvey(title: string, description?: string, questions?: any[]) {
    return this.prisma.survey.create({
      data: {
        title,
        description,
        questions: {
          create: questions
        }
      },
      include: { questions: true }
    });
  }

  async getSurveys() {
    return this.prisma.survey.findMany({
      include: { questions: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async submitResponse(surveyId: string, userId: string | null, answers: string) {
    return this.prisma.surveyResponse.create({
      data: {
        surveyId,
        userId,
        answers // Store as JSON string for flexibility
      }
    });
  }

  async getSurveyResponses(surveyId: string) {
    return this.prisma.surveyResponse.findMany({
      where: { surveyId },
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
  }
}
