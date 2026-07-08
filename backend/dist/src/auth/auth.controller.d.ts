import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            student: any;
            profile: any;
        };
    } | {
        error: string;
    }>;
    getAdminDashboard(req: any): {
        message: string;
        user: any;
    };
    getProfile(req: any): any;
}
