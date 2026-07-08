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
exports.TimetableService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TimetableService = class TimetableService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getClassTimetable(classId) {
        return this.prisma.timetablePeriod.findMany({
            where: { classId },
            include: {
                subject: true,
                teacher: {
                    include: {
                        user: { include: { profile: true } }
                    }
                }
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
    }
    async addPeriod(classId, dayOfWeek, startTime, endTime, subjectId, teacherId) {
        const existing = await this.prisma.timetablePeriod.findFirst({
            where: {
                classId,
                dayOfWeek,
                OR: [
                    {
                        AND: [
                            { startTime: { lte: startTime } },
                            { endTime: { gt: startTime } }
                        ]
                    },
                    {
                        AND: [
                            { startTime: { lt: endTime } },
                            { endTime: { gte: endTime } }
                        ]
                    }
                ]
            }
        });
        if (existing) {
            throw new common_1.BadRequestException('A period already exists in this time slot for this class.');
        }
        return this.prisma.timetablePeriod.create({
            data: {
                classId,
                dayOfWeek,
                startTime,
                endTime,
                subjectId,
                teacherId
            },
            include: {
                subject: true,
                teacher: {
                    include: {
                        user: { include: { profile: true } }
                    }
                }
            }
        });
    }
    async deletePeriod(id) {
        const period = await this.prisma.timetablePeriod.findUnique({ where: { id } });
        if (!period)
            throw new common_1.NotFoundException('Period not found');
        return this.prisma.timetablePeriod.delete({
            where: { id },
        });
    }
};
exports.TimetableService = TimetableService;
exports.TimetableService = TimetableService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TimetableService);
//# sourceMappingURL=timetable.service.js.map