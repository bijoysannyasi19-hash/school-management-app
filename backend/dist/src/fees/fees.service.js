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
exports.FeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let FeesService = class FeesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInvoice(data) {
        return this.prisma.feeInvoice.create({
            data: {
                studentId: data.studentId,
                amount: data.amount,
                dueDate: data.dueDate,
                description: data.description,
                status: 'PENDING'
            }
        });
    }
    async getStudentInvoices(studentId) {
        return this.prisma.feeInvoice.findMany({
            where: { studentId },
            include: { payments: true }
        });
    }
    async getAllInvoices() {
        return this.prisma.feeInvoice.findMany({
            include: {
                payments: true,
                student: {
                    include: { user: { include: { profile: true } } }
                }
            },
            orderBy: { dueDate: 'asc' }
        });
    }
    async recordPayment(invoiceId, amount, method, reference) {
        const payment = await this.prisma.feePayment.create({
            data: {
                invoiceId,
                amount,
                method,
                reference
            }
        });
        const invoice = await this.prisma.feeInvoice.findUnique({
            where: { id: invoiceId },
            include: { payments: true }
        });
        if (!invoice)
            throw new Error('Invoice not found');
        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
        if (totalPaid >= invoice.amount) {
            await this.prisma.feeInvoice.update({
                where: { id: invoiceId },
                data: { status: 'PAID' }
            });
        }
        return payment;
    }
};
exports.FeesService = FeesService;
exports.FeesService = FeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeesService);
//# sourceMappingURL=fees.service.js.map