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
exports.SafetyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SafetyService = class SafetyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async triggerEmergencyAlert(reportedBy, type, message) {
        return this.prisma.emergencyAlert.create({
            data: { reportedBy, type, message, status: 'ACTIVE' }
        });
    }
    async getActiveAlerts() {
        return this.prisma.emergencyAlert.findMany({
            where: { status: 'ACTIVE' },
            include: { reporter: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async resolveAlert(alertId) {
        return this.prisma.emergencyAlert.update({
            where: { id: alertId },
            data: { status: 'RESOLVED' }
        });
    }
    async submitIncidentReport(reportedBy, title, description) {
        return this.prisma.incidentReport.create({
            data: { reportedBy, title, description }
        });
    }
    async getIncidentReports() {
        return this.prisma.incidentReport.findMany({
            include: { reporter: { include: { profile: true } } },
            orderBy: { date: 'desc' }
        });
    }
};
exports.SafetyService = SafetyService;
exports.SafetyService = SafetyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SafetyService);
//# sourceMappingURL=safety.service.js.map