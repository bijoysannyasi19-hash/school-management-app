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
exports.SurveysController = void 0;
const common_1 = require("@nestjs/common");
const surveys_service_1 = require("./surveys.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
let SurveysController = class SurveysController {
    surveysService;
    constructor(surveysService) {
        this.surveysService = surveysService;
    }
    createSurvey(body) {
        return this.surveysService.createSurvey(body.title, body.description, body.questions);
    }
    getSurveys() {
        return this.surveysService.getSurveys();
    }
    submitResponse(req, surveyId, body) {
        const userId = body.isAnonymous ? null : req.user.userId;
        return this.surveysService.submitResponse(surveyId, userId, body.answers);
    }
    getSurveyResponses(surveyId) {
        return this.surveysService.getSurveyResponses(surveyId);
    }
};
exports.SurveysController = SurveysController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "createSurvey", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "getSurveys", null);
__decorate([
    (0, common_1.Post)(':surveyId/response'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('surveyId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "submitResponse", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.SCHOOL_ADMIN, role_enum_1.Role.PRINCIPAL),
    (0, common_1.Get)(':surveyId/responses'),
    __param(0, (0, common_1.Param)('surveyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "getSurveyResponses", null);
exports.SurveysController = SurveysController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('surveys'),
    __metadata("design:paramtypes", [surveys_service_1.SurveysService])
], SurveysController);
//# sourceMappingURL=surveys.controller.js.map