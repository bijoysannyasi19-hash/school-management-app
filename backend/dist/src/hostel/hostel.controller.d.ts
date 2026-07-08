import { HostelService } from './hostel.service';
export declare class HostelController {
    private readonly hostelService;
    constructor(hostelService: HostelService);
    createRoom(body: {
        roomNumber: string;
        capacity: number;
    }): Promise<{
        id: string;
        capacity: number;
        roomNumber: string;
        occupied: number;
    }>;
    getAllRooms(): Promise<({
        students: ({
            user: {
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
            };
        } & {
            id: string;
            userId: string;
            admissionNo: string;
            rollNo: string | null;
            bloodGroup: string | null;
            emergencyContact: string | null;
            parentId: string | null;
            hostelRoomId: string | null;
        })[];
    } & {
        id: string;
        capacity: number;
        roomNumber: string;
        occupied: number;
    })[]>;
    getMyRoom(req: any): Promise<{
        id: string;
        capacity: number;
        roomNumber: string;
        occupied: number;
    }>;
    allocateRoom(roomId: string, studentId: string): Promise<{
        id: string;
        userId: string;
        admissionNo: string;
        rollNo: string | null;
        bloodGroup: string | null;
        emergencyContact: string | null;
        parentId: string | null;
        hostelRoomId: string | null;
    }>;
}
