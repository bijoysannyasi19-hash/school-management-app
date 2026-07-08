import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(data: { studentId: string; amount: number; dueDate: Date; description: string }) {
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

  async getStudentInvoices(studentId: string) {
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

  async recordPayment(invoiceId: string, amount: number, method: string, reference?: string) {
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

    if (!invoice) throw new Error('Invoice not found');

    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= invoice.amount) {
      await this.prisma.feeInvoice.update({
        where: { id: invoiceId },
        data: { status: 'PAID' }
      });
    }

    return payment;
  }
}
