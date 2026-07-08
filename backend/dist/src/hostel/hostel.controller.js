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
exports.HostelController = void 0;
const common_1 = require("@nestjs/common");
const hostel_service_1 = require("./hostel.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
let HostelController = class HostelController {
    hostelService;
    constructor(hostelService) {
        this.hostelService = hostelService;
    }
    createRoom(body) {
        return this.hostelService.createRoom(body);
    }
    getAllRooms() {
        return this.hostelService.getAllRooms();
    }
    getMyRoom(req) {
        return this.hostelService.getMyRoom(req.user.userId);
    }
    allocateRoom(roomId, studentId) {
        return this.hostelService.allocateRoom(roomId, studentId);
    }
};
exports.HostelController = HostelController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.HOSTEL_WARDEN),
    (0, common_1.Post)('rooms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "createRoom", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.HOSTEL_WARDEN),
    (0, common_1.Get)('rooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "getAllRooms", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT),
    (0, common_1.Get)('rooms/my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "getMyRoom", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.HOSTEL_WARDEN),
    (0, common_1.Put)('rooms/:roomId/allocate/:studentId'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "allocateRoom", null);
exports.HostelController = HostelController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('hostel'),
    __metadata("design:paramtypes", [hostel_service_1.HostelService])
], HostelController);
//# sourceMappingURL=hostel.controller.js.map