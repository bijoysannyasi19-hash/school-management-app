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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let WorkspaceService = class WorkspaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createWorkspace(classId, name, description) {
        return this.prisma.classWorkspace.create({
            data: { classId, name, description }
        });
    }
    async getWorkspaceByClass(classId) {
        return this.prisma.classWorkspace.findUnique({
            where: { classId },
            include: {
                posts: {
                    include: { author: { include: { profile: true } }, files: true },
                    orderBy: { createdAt: 'desc' }
                },
                assignments: true
            }
        });
    }
    async createPost(workspaceId, authorId, content, isPinned = false) {
        return this.prisma.workspacePost.create({
            data: { workspaceId, authorId, content, isPinned }
        });
    }
    async createAssignment(workspaceId, title, description, dueDate, attachmentUrl) {
        return this.prisma.workspaceAssignment.create({
            data: {
                title,
                description,
                dueDate,
                attachmentUrl,
                workspaceId
            }
        });
    }
    async submitAssignment(assignmentId, userId, fileUrl) {
        const student = await this.prisma.student.findUnique({
            where: { userId }
        });
        if (!student) {
            throw new Error('Student not found for this user');
        }
        return this.prisma.assignmentSubmission.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId,
                    studentId: student.id
                }
            },
            update: {
                fileUrl,
                submittedAt: new Date()
            },
            create: {
                assignmentId,
                studentId: student.id,
                fileUrl
            }
        });
    }
    async getSubmissions(assignmentId) {
        return this.prisma.assignmentSubmission.findMany({
            where: { assignmentId },
            include: {
                student: {
                    include: { user: { include: { profile: true } } }
                }
            }
        });
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map