const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.studentClass.findMany({
  include: {
    student: {
      include: {
        attendance: {
          where: { date: new Date('2026-07-04') }
        }
      }
    }
  }
}).then(r => {
  console.log(JSON.stringify(r[0], null, 2));
}).finally(() => { p.$disconnect(); process.exit(0); });
