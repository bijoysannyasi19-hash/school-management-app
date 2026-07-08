const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSubjects() {
  const classes = await prisma.class.findMany({ include: { subjects: true } });
  console.log(classes);
  
  for (const cls of classes) {
    if (cls.subjects.length === 0) {
      const subjects = ['Mathematics', 'Science', 'English', 'History'];
      for (const sub of subjects) {
        await prisma.subject.create({
          data: {
            name: sub,
            code: sub.substring(0, 3).toUpperCase(),
            classId: cls.id,
            
          }
        });
      }
      console.log('Added subjects to class:', cls.name, cls.section);
    }
  }
}

addSubjects().catch(console.error).finally(() => prisma.$disconnect());
