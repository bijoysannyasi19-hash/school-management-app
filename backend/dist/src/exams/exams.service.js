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
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ExamsService = class ExamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createExam(data) {
        return this.prisma.exam.create({
            data: {
                title: data.title,
                date: new Date(data.date),
                academicYear: data.academicYear,
                classId: data.classId,
            },
        });
    }
    async getExamsByClass(classId) {
        return this.prisma.exam.findMany({
            where: { classId },
            orderBy: { date: 'desc' },
            include: {
                results: true,
            },
        });
    }
    async getExamResults(examId) {
        return this.prisma.examResult.findMany({
            where: { examId },
            include: {
                student: {
                    include: {
                        user: {
                            include: { profile: true }
                        }
                    }
                },
                subject: true,
            }
        });
    }
    async saveExamResults(examId, results) {
        const saved = [];
        for (const res of results) {
            const savedRes = await this.prisma.examResult.upsert({
                where: {
                    examId_studentId_subjectId: {
                        examId,
                        studentId: res.studentId,
                        subjectId: res.subjectId,
                    }
                },
                update: {
                    marksObtained: res.marksObtained,
                    maxMarks: res.maxMarks,
                    remarks: res.remarks,
                },
                create: {
                    examId,
                    studentId: res.studentId,
                    subjectId: res.subjectId,
                    marksObtained: res.marksObtained,
                    maxMarks: res.maxMarks,
                    remarks: res.remarks,
                },
            });
            saved.push(savedRes);
        }
        return saved;
    }
    async getExamRankings(examId) {
        const results = await this.prisma.examResult.findMany({
            where: { examId },
        });
        const studentTotals = {};
        results.forEach(res => {
            if (!studentTotals[res.studentId])
                studentTotals[res.studentId] = 0;
            studentTotals[res.studentId] += res.marksObtained;
        });
        const sortedStudents = Object.keys(studentTotals).sort((a, b) => studentTotals[b] - studentTotals[a]);
        const rankings = {};
        sortedStudents.forEach((studentId, index) => {
            rankings[studentId] = index + 1;
        });
        return { rankings, totalStudents: sortedStudents.length };
    }
    async getStudentReportCard(studentId, academicYear) {
        const results = await this.prisma.examResult.findMany({
            where: {
                studentId,
                exam: {
                    academicYear
                }
            },
            include: {
                exam: true,
                subject: true,
            },
            orderBy: [
                { exam: { date: 'asc' } },
                { subject: { name: 'asc' } }
            ]
        });
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                user: { include: { profile: true } },
                classes: { include: { class: true } }
            }
        });
        const examIds = [...new Set(results.map(r => r.examId))];
        const examRankings = {};
        for (const examId of examIds) {
            const { rankings, totalStudents } = await this.getExamRankings(examId);
            examRankings[examId] = {
                rank: rankings[studentId] || 0,
                totalStudents
            };
        }
        return { student, results, examRankings };
    }
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map