import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create Admin User
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  
  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      firstName: 'Super',
      lastName: 'Admin',
    }
  });
  console.log('Created Admin User:', admin.email);

  // Seed School Stats
  const stats = [
    { key: 'total_students', label: 'Students', value: 1240 },
    { key: 'total_teachers', label: 'Teachers', value: 84 },
    { key: 'attendance_rate', label: 'Attendance', value: 94 },
    { key: 'monthly_revenue', label: 'Revenue', value: 42000 },
  ];

  for (const stat of stats) {
    await prisma.schoolDashboardCounter.upsert({
      where: { key: stat.key },
      update: { value: stat.value },
      create: {
        key: stat.key,
        label: stat.label,
        value: stat.value,
        category: 'dashboard',
      },
    });
  }

  // Generate 5 Teachers
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics'];
  for (let i = 0; i < 5; i++) {
    const teacherEmail = `teacher${i+1}@school.com`;
    const user = await prisma.user.upsert({
      where: { email: teacherEmail },
      update: {},
      create: {
        email: teacherEmail,
        password: passwordHash,
        role: 'TEACHER',
        profile: {
          create: {
            firstName: 'Teacher',
            lastName: `${i+1}`,
          }
        },
        teacher: {
          create: {
            employeeId: `EMP2026${i}`,
            qualification: 'M.Ed',
          }
        }
      }
    });
  }
  console.log('Seeded 5 Teachers');

  // Generate 10 Students
  const grades = ['10th Grade', '9th Grade', '11th Grade', '12th Grade', '8th Grade'];
  for (let i = 0; i < 10; i++) {
    const studentEmail = `student${i+1}@school.com`;
    await prisma.user.upsert({
      where: { email: studentEmail },
      update: {},
      create: {
        email: studentEmail,
        password: passwordHash,
        role: 'STUDENT',
        profile: {
          create: {
            firstName: 'Student',
            lastName: `${i+1}`,
          }
        },
        student: {
          create: {
            admissionNo: `ADM2026${i}`,
            bloodGroup: 'O+',
          }
        }
      }
    });
  }
  console.log('Seeded 10 Students');

  // Seed a Class
  const class10A = await prisma.class.upsert({
    where: { id: 'class-10-A-id' }, // use a fixed ID for easy upsert, or just use first match
    update: {},
    create: {
      id: 'class-10-A-id',
      name: '10',
      section: 'A',
      teacherId: (await prisma.teacher.findFirst())?.id
    }
  });

  // Assign students to the class
  const allStudents = await prisma.student.findMany();
  for (const student of allStudents) {
    await prisma.studentClass.upsert({
      where: {
        studentId_classId_academicYear: {
          studentId: student.id,
          classId: class10A.id,
          academicYear: '2026-2027'
        }
      },
      update: {},
      create: {
        studentId: student.id,
        classId: class10A.id,
        academicYear: '2026-2027'
      }
    });
  }
  console.log('Seeded Class and assigned Students');

  // --- NEW RICH DATA ---

  // 1. Attendance for Today
  const today = new Date();
  for (const student of allStudents.slice(0, 8)) {
    await prisma.attendance.create({
      data: {
        date: today,
        status: 'PRESENT',
        studentId: student.id,
      }
    });
  }
  // 2 absent
  for (const student of allStudents.slice(8, 10)) {
    await prisma.attendance.create({
      data: {
        date: today,
        status: 'ABSENT',
        remarks: 'Sick leave',
        studentId: student.id,
      }
    });
  }
  console.log('Seeded Attendance logs');

  // 2. Digital Workspace (LMS)
  const workspace = await prisma.classWorkspace.create({
    data: {
      name: '10th Grade Science Hub',
      description: 'Central hub for all Science materials',
      classId: class10A.id
    }
  });

  // Posts
  const teacher1 = await prisma.user.findFirst({ where: { email: 'teacher1@school.com' } });
  if (teacher1) {
    await prisma.workspacePost.create({
      data: {
        content: 'Welcome to the new semester! Please check the syllabus attached below.',
        isPinned: true,
        workspaceId: workspace.id,
        authorId: teacher1.id
      }
    });

    // Assignments
    const assignment = await prisma.workspaceAssignment.create({
      data: {
        title: 'Photosynthesis Lab Report',
        description: 'Submit your lab report as a PDF.',
        dueDate: new Date(new Date().setDate(today.getDate() + 7)),
        workspaceId: workspace.id
      }
    });

    // One Student Submission
    const firstStudentUser = await prisma.user.findFirst({ where: { email: 'student1@school.com' } });
    if (firstStudentUser) {
      const studentEntity = await prisma.student.findFirst({ where: { userId: firstStudentUser.id } });
      if (studentEntity) {
        await prisma.assignmentSubmission.create({
          data: {
            fileUrl: 'https://example.com/student-report.pdf',
            assignmentId: assignment.id,
            studentId: studentEntity.id
          }
        });
      }
    }
  }
  console.log('Seeded Workspace LMS data');

  // 3. Library Books
  const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', totalCopies: 5, available: 5 },
    { title: 'Calculus Early Transcendentals', author: 'James Stewart', isbn: '9781285741550', totalCopies: 3, available: 2 },
    { title: 'Biology: A Global Approach', author: 'Campbell', isbn: '9781292170435', totalCopies: 10, available: 10 },
  ];
  for (const book of books) {
    await prisma.book.create({ data: book });
  }
  console.log('Seeded Library Books');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
