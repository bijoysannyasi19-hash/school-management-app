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
exports.SchoolStatsController = void 0;
const common_1 = require("@nestjs/common");
const school_stats_service_1 = require("./school-stats.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
let SchoolStatsController = class SchoolStatsController {
    schoolStatsService;
    constructor(schoolStatsService) {
        this.schoolStatsService = schoolStatsService;
    }
    getAllCounters() {
        return this.schoolStatsService.getAllCounters();
    }
    getChartData() {
        return this.schoolStatsService.getChartData();
    }
    getRecentActivity() {
        return this.schoolStatsService.getRecentActivity();
    }
    upsertCounter(body) {
        return this.schoolStatsService.upsertCounter(body.key, body.label, body.value, body.iconUrl, body.category);
    }
    incrementCounter(key, amount) {
        return this.schoolStatsService.incrementCounter(key, amount);
    }
};
exports.SchoolStatsController = SchoolStatsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchoolStatsController.prototype, "getAllCounters", null);
__decorate([
    (0, common_1.Get)('chart-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchoolStatsController.prototype, "getChartData", null);
__decorate([
    (0, common_1.Get)('activity'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchoolStatsController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolStatsController.prototype, "upsertCounter", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL),
    (0, common_1.Put)(':key/increment'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SchoolStatsController.prototype, "incrementCounter", null);
exports.SchoolStatsController = SchoolStatsController = __decorate([
    (0, common_1.Controller)('school-stats'),
    __metadata("design:paramtypes", [school_stats_service_1.SchoolStatsService])
], SchoolStatsController);
//# sourceMappingURL=school-stats.controller.js.map