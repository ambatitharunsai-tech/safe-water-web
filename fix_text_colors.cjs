const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace all dark text colors with light ones
  content = content.replace(/text-slate-900/g, 'text-white');
  content = content.replace(/text-slate-800/g, 'text-slate-100');
  content = content.replace(/text-slate-700/g, 'text-slate-200');
  content = content.replace(/text-slate-600/g, 'text-slate-300');
  content = content.replace(/text-slate-500/g, 'text-slate-400');
  
  content = content.replace(/text-gray-900/g, 'text-white');
  content = content.replace(/text-gray-800/g, 'text-gray-100');
  content = content.replace(/text-gray-700/g, 'text-gray-200');
  content = content.replace(/text-gray-600/g, 'text-gray-300');
  
  // Make sure links are readable (if they were dark)
  content = content.replace(/text-black/g, 'text-white');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated text colors in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
