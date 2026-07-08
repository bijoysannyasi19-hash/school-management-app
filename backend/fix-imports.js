const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const srcDir = path.join(__dirname, 'src');

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace standalone import
    content = content.replace(/import { Role } from '@prisma\/client';/g, "import { Role } from '../auth/role.enum';");
    
    // Replace combined import (e.g. import { Role, Prisma } from ...)
    // If it's a combined import, we don't bother for now unless the compilation fails.
    
    fs.writeFileSync(filePath, content);
  }
});
console.log('Imports replaced.');
