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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markAttendance(studentId, date, status, remarks) {
        return this.prisma.attendance.upsert({
            where: {
                studentId_date: {
                    studentId,
                    date,
                },
            },
            update: {
                status,
                remarks,
            },
            create: {
                studentId,
                date,
                status,
                remarks,
            },
        });
    }
    async bulkMarkAttendance(records) {
        const saved = [];
        for (const record of records) {
            saved.push(await this.markAttendance(record.studentId, record.date, record.status, record.remarks));
        }
        return saved;
    }
    async getAttendanceByStudent(studentId, startDate, endDate) {
        return this.prisma.attendance.findMany({
            where: {
                studentId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
    }
    async getAttendanceByClass(classId, date) {
        return this.prisma.studentClass.findMany({
            where: { classId },
            include: {
                student: {
                    include: {
                        user: { include: { profile: true } },
                        attendance: {
                            where: { date }
                        }
                    }
                }
            }
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map