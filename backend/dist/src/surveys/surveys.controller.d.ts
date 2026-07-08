import { SurveysService } from './surveys.service';
export declare class SurveysController {
    private readonly surveysService;
    constructor(surveysService: SurveysService);
    createSurvey(body: {
        title: string;
        description?: string;
        questions?: any[];
    }): Promise<{
        questions: {
            id: string;
            type: string;
            text: string;
            options: string;
            surveyId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
    }>;
    getSurveys(): Promise<({
        questions: {
            id: string;
            type: string;
            text: string;
            options: string;
            surveyId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
    })[]>;
    submitResponse(req: any, surveyId: string, body: {
        answers: string;
        isAnonymous?: boolean;
    }): Promise<{
        id: string;
        userId: string | null;
        submittedAt: Date;
        answers: string;
        surveyId: string;
    }>;
    getSurveyResponses(surveyId: string): Promise<({
        user: ({
            profile: {
                id: string;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string | null;
                dob: Date | null;
                gender: string | null;
            } | null;
        } & {
            id: string;
            email: string | null;
            phone: string | null;
            password: string;
            role: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            lastLogin: Date | null;
        }) | null;
    } & {
        id: string;
        userId: string | null;
        submittedAt: Date;
        answers: string;
        surveyId: string;
    })[]>;
}
