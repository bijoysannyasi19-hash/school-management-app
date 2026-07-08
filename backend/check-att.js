const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.attendance.findMany({orderBy:{date:'desc'}, take:5}).then(r => {
  console.log(r);
}).finally(() => { p.$disconnect(); process.exit(0); });
