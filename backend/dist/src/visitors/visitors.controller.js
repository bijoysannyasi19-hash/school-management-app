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
exports.VisitorsController = void 0;
const common_1 = require("@nestjs/common");
const visitors_service_1 = require("./visitors.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
let VisitorsController = class VisitorsController {
    visitorsService;
    constructor(visitorsService) {
        this.visitorsService = visitorsService;
    }
    checkInVisitor(body) {
        return this.visitorsService.checkInVisitor(body.visitorName, body.purpose, body.hostId);
    }
    getVisitors(activeOnly) {
        const includeCheckedOut = activeOnly !== 'true';
        return this.visitorsService.getVisitors(includeCheckedOut);
    }
    checkOutVisitor(id) {
        return this.visitorsService.checkOutVisitor(id);
    }
};
exports.VisitorsController = VisitorsController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL),
    (0, common_1.Post)('checkin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VisitorsController.prototype, "checkInVisitor", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VisitorsController.prototype, "getVisitors", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL),
    (0, common_1.Put)(':id/checkout'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VisitorsController.prototype, "checkOutVisitor", null);
exports.VisitorsController = VisitorsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('visitors'),
    __metadata("design:paramtypes", [visitors_service_1.VisitorsService])
], VisitorsController);
//# sourceMappingURL=visitors.controller.js.map