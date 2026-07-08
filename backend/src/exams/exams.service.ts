import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async createExam(data: { title: string; date: string; academicYear: string; classId: string }) {
    return this.prisma.exam.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        academicYear: data.academicYear,
        classId: data.classId,
      },
    });
  }

  async getExamsByClass(classId: string) {
    return this.prisma.exam.findMany({
      where: { classId },
      orderBy: { date: 'desc' },
      include: {
        results: true,
      },
    });
  }

  async getExamResults(examId: string) {
    return this.prisma.examResult.findMany({
      where: { examId },
      include: {
        student: {
          include: {
            user: {
              include: { profile: true }
            }
          }
        },
        subject: true,
      }
    });
  }

  async saveExamResults(examId: string, results: any[]) {
    // results array contains { studentId, subjectId, marksObtained, maxMarks, remarks }
    const saved: any[] = [];
    for (const res of results) {
      const savedRes = await this.prisma.examResult.upsert({
        where: {
          examId_studentId_subjectId: {
            examId,
            studentId: res.studentId,
            subjectId: res.subjectId,
          }
        },
        update: {
          marksObtained: res.marksObtained,
          maxMarks: res.maxMarks,
          remarks: res.remarks,
        },
        create: {
          examId,
          studentId: res.studentId,
          subjectId: res.subjectId,
          marksObtained: res.marksObtained,
          maxMarks: res.maxMarks,
          remarks: res.remarks,
        },
      });
      saved.push(savedRes);
    }
    return saved;
  }

  async getExamRankings(examId: string) {
    const results = await this.prisma.examResult.findMany({
      where: { examId },
    });

    // Group by studentId and calculate total marks
    const studentTotals: { [key: string]: number } = {};
    results.forEach(res => {
      if (!studentTotals[res.studentId]) studentTotals[res.studentId] = 0;
      studentTotals[res.studentId] += res.marksObtained;
    });

    // Sort by descending marks
    const sortedStudents = Object.keys(studentTotals).sort((a, b) => studentTotals[b] - studentTotals[a]);
    
    const rankings: { [key: string]: number } = {};
    sortedStudents.forEach((studentId, index) => {
      rankings[studentId] = index + 1;
    });

    return { rankings, totalStudents: sortedStudents.length };
  }

  async getStudentReportCard(studentId: string, academicYear: string) {
    // Fetch all exams and results for the student in the given academic year
    const results = await this.prisma.examResult.findMany({
      where: {
        studentId,
        exam: {
          academicYear
        }
      },
      include: {
        exam: true,
        subject: true,
      },
      orderBy: [
        { exam: { date: 'asc' } },
        { subject: { name: 'asc' } }
      ]
    });

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { include: { profile: true } },
        classes: { include: { class: true } }
      }
    });

    // Group exams to find distinct exam IDs
    const examIds = [...new Set(results.map(r => r.examId))];
    const examRankings: { [key: string]: { rank: number; totalStudents: number } } = {};

    for (const examId of examIds) {
      const { rankings, totalStudents } = await this.getExamRankings(examId);
      examRankings[examId] = {
        rank: rankings[studentId] || 0,
        totalStudents
      };
    }

    return { student, results, examRankings };
  }
}
