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
exports.DiscussionsController = void 0;
const common_1 = require("@nestjs/common");
const discussions_service_1 = require("./discussions.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
let DiscussionsController = class DiscussionsController {
    discussionsService;
    constructor(discussionsService) {
        this.discussionsService = discussionsService;
    }
    createBoard(body) {
        return this.discussionsService.createBoard(body.classId, body.title, body.description);
    }
    getBoardsByClass(classId) {
        return this.discussionsService.getBoardsByClass(classId);
    }
    getThreadsByBoard(boardId) {
        return this.discussionsService.getThreadsByBoard(boardId);
    }
    createThread(req, boardId, body) {
        return this.discussionsService.createThread(boardId, req.user.userId, body.title, body.content);
    }
    getThread(threadId) {
        return this.discussionsService.getThread(threadId);
    }
    replyToThread(req, threadId, body) {
        return this.discussionsService.replyToThread(threadId, req.user.userId, body.content);
    }
};
exports.DiscussionsController = DiscussionsController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER),
    (0, common_1.Post)('board'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "createBoard", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Get)('class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "getBoardsByClass", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Get)('board/:boardId/threads'),
    __param(0, (0, common_1.Param)('boardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "getThreadsByBoard", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Post)('board/:boardId/thread'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('boardId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "createThread", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Get)('thread/:threadId'),
    __param(0, (0, common_1.Param)('threadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "getThread", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Post)('thread/:threadId/reply'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('threadId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "replyToThread", null);
exports.DiscussionsController = DiscussionsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('discussions'),
    __metadata("design:paramtypes", [discussions_service_1.DiscussionsService])
], DiscussionsController);
//# sourceMappingURL=discussions.controller.js.map