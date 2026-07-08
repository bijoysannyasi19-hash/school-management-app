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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ClassesService = class ClassesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.class.findMany({
            include: {
                classTeacher: {
                    include: { user: { include: { profile: true } } }
                },
                subjects: true,
                students: {
                    include: { student: { include: { user: { include: { profile: true } } } } }
                }
            }
        });
    }
    async findOne(id) {
        return this.prisma.class.findUnique({
            where: { id },
            include: {
                classTeacher: true,
                subjects: {
                    include: { teacher: true }
                },
                students: {
                    include: { student: { include: { user: { include: { profile: true } } } } }
                }
            }
        });
    }
    async create(data) {
        return this.prisma.class.create({
            data: {
                name: data.name,
                section: data.section,
                teacherId: data.teacherId,
            }
        });
    }
    async assignStudent(classId, studentId, academicYear) {
        return this.prisma.studentClass.create({
            data: {
                studentId,
                classId,
                academicYear,
            }
        });
    }
    async addSubject(classId, data) {
        return this.prisma.subject.create({
            data: {
                name: data.name,
                code: data.code,
                classId,
                teacherId: data.teacherId
            }
        });
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map