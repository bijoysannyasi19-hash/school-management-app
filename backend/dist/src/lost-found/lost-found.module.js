"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostFoundModule = void 0;
const common_1 = require("@nestjs/common");
const lost_found_service_1 = require("./lost-found.service");
const lost_found_controller_1 = require("./lost-found.controller");
const prisma_service_1 = require("../prisma.service");
let LostFoundModule = class LostFoundModule {
};
exports.LostFoundModule = LostFoundModule;
exports.LostFoundModule = LostFoundModule = __decorate([
    (0, common_1.Module)({
        controllers: [lost_found_controller_1.LostFoundController],
        providers: [lost_found_service_1.LostFoundService, prisma_service_1.PrismaService],
    })
], LostFoundModule);
//# sourceMappingURL=lost-found.module.js.map