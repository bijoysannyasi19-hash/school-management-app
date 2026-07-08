import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.ACCOUNTANT)
  @Post('invoice')
  createInvoice(@Body() body: { studentId: string; amount: number; dueDate: string; description: string }) {
    return this.feesService.createInvoice({
      ...body,
      dueDate: new Date(body.dueDate)
    });
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT)
  @Get('student/:studentId')
  getStudentInvoices(@Param('studentId') studentId: string) {
    return this.feesService.getStudentInvoices(studentId);
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.ACCOUNTANT)
  @Get()
  getAllInvoices() {
    return this.feesService.getAllInvoices();
  }

  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.ACCOUNTANT)
  @Post('payment')
  recordPayment(@Body() body: { invoiceId: string; amount: number; method: string; reference?: string }) {
    return this.feesService.recordPayment(body.invoiceId, body.amount, body.method, body.reference);
  }
}
