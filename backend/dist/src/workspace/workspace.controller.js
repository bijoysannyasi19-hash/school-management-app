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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const workspace_service_1 = require("./workspace.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
const multerOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
    }),
};
let WorkspaceController = class WorkspaceController {
    workspaceService;
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    createWorkspace(body) {
        return this.workspaceService.createWorkspace(body.classId, body.name, body.description);
    }
    getWorkspaceByClass(classId) {
        return this.workspaceService.getWorkspaceByClass(classId);
    }
    createPost(req, workspaceId, body) {
        return this.workspaceService.createPost(workspaceId, req.user.userId, body.content, body.isPinned);
    }
    createAssignment(workspaceId, body, file) {
        const finalAttachmentUrl = file ? `/uploads/${file.filename}` : body.attachmentUrl;
        return this.workspaceService.createAssignment(workspaceId, body.title, body.description, new Date(body.dueDate), finalAttachmentUrl);
    }
    submitAssignment(req, assignmentId, body, file) {
        const finalFileUrl = file ? `/uploads/${file.filename}` : body.fileUrl;
        if (!finalFileUrl) {
            throw new Error('A file or URL must be provided');
        }
        return this.workspaceService.submitAssignment(assignmentId, req.user.userId, finalFileUrl);
    }
    getSubmissions(assignmentId) {
        return this.workspaceService.getSubmissions(assignmentId);
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "createWorkspace", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Get)('class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "getWorkspaceByClass", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Post)(':workspaceId/post'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "createPost", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER),
    (0, common_1.Post)(':workspaceId/assignment'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "createAssignment", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT),
    (0, common_1.Post)('assignment/:id/submit'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "submitAssignment", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER),
    (0, common_1.Get)('assignment/:id/submissions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "getSubmissions", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('workspace'),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map