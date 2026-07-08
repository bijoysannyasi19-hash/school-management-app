import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, body: {
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        avatarUrl?: string;
    }): Promise<{
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
    }>;
    updatePassword(req: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
