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
exports.LostFoundService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let LostFoundService = class LostFoundService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async reportItem(reporterId, type, itemName, description) {
        return this.prisma.lostFoundItem.create({
            data: { reporterId, type, itemName, description, status: 'REPORTED' }
        });
    }
    async getItems(status, type) {
        const where = {};
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        return this.prisma.lostFoundItem.findMany({
            where,
            include: { reporter: { include: { profile: true } } },
            orderBy: { dateReported: 'desc' }
        });
    }
    async updateItemStatus(itemId, status) {
        return this.prisma.lostFoundItem.update({
            where: { id: itemId },
            data: { status }
        });
    }
};
exports.LostFoundService = LostFoundService;
exports.LostFoundService = LostFoundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LostFoundService);
//# sourceMappingURL=lost-found.service.js.map