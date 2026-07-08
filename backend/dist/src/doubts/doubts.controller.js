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
exports.DoubtsController = void 0;
const common_1 = require("@nestjs/common");
const doubts_service_1 = require("./doubts.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
let DoubtsController = class DoubtsController {
    doubtsService;
    constructor(doubtsService) {
        this.doubtsService = doubtsService;
    }
    createDoubt(req, body) {
        return this.doubtsService.createDoubt(req.user.userId, body.subject, body.content, body.isUrgent, body.taggedTeacherId);
    }
    getDoubts(subject, isResolved, isUrgent, teacherId) {
        return this.doubtsService.getDoubts({
            subject,
            isResolved: isResolved !== undefined ? isResolved === 'true' : undefined,
            isUrgent: isUrgent !== undefined ? isUrgent === 'true' : undefined,
            teacherId
        });
    }
    replyToDoubt(req, id, body) {
        return this.doubtsService.replyToDoubt(id, req.user.userId, body.content);
    }
    markResolved(id) {
        return this.doubtsService.markResolved(id);
    }
};
exports.DoubtsController = DoubtsController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DoubtsController.prototype, "createDoubt", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('subject')),
    __param(1, (0, common_1.Query)('isResolved')),
    __param(2, (0, common_1.Query)('isUrgent')),
    __param(3, (0, common_1.Query)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], DoubtsController.prototype, "getDoubts", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], DoubtsController.prototype, "replyToDoubt", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Put)(':id/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoubtsController.prototype, "markResolved", null);
exports.DoubtsController = DoubtsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('doubts'),
    __metadata("design:paramtypes", [doubts_service_1.DoubtsService])
], DoubtsController);
//# sourceMappingURL=doubts.controller.js.map