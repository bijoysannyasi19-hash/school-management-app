"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let HostelService = class HostelService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRoom(data) {
        return this.prisma.hostelRoom.create({ data });
    }
    async getAllRooms() {
        return this.prisma.hostelRoom.findMany({
            include: {
                students: {
                    include: { user: { include: { profile: true } } }
                }
            }
        });
    }
    async getMyRoom(userId) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
            include: { hostelRoom: true }
        });
        if (!student || !student.hostelRoom) {
            throw new common_1.BadRequestException('No room assigned');
        }
        return student.hostelRoom;
    }
    async allocateRoom(roomId, studentId) {
        const room = await this.prisma.hostelRoom.findUnique({ where: { id: roomId } });
        if (!room || room.occupied >= room.capacity) {
            throw new common_1.BadRequestException('Room is full or does not exist');
        }
        const student = await this.prisma.student.update({
            where: { id: studentId },
            data: { hostelRoomId: roomId }
        });
        await this.prisma.hostelRoom.update({
            where: { id: roomId },
            data: { occupied: { increment: 1 } }
        });
        return student;
    }
};
exports.HostelService = HostelService;
exports.HostelService = HostelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HostelService);
//# sourceMappingURL=hostel.service.js.map