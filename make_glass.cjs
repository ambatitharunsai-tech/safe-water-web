const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'src/components/sections');
const pagesDir = path.join(__dirname, 'src/pages');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Make main section backgrounds transparent
  content = content.replace(/className="([^"]*)bg-white([^"]*)"/g, 'className="$1bg-transparent$2"');
  content = content.replace(/className="([^"]*)bg-brand-50([^"]*)"/g, 'className="$1bg-transparent$2"');
  content = content.replace(/className="([^"]*)bg-slate-50([^"]*)"/g, 'className="$1bg-transparent$2"');
  content = content.replace(/className="([^"]*)bg-slate-900([^"]*)"/g, 'className="$1bg-transparent$2"');
  
  // Make cards glassmorphic
  content = content.replace(/bg-white rounded/g, 'bg-white/10 backdrop-blur-md border-white/20 rounded');
  content = content.replace(/bg-slate-50 rounded/g, 'bg-white/5 backdrop-blur-md border-white/10 rounded');
  
  // Update text colors for dark background
  content = content.replace(/text-slate-900/g, 'text-white');
  content = content.replace(/text-slate-800/g, 'text-slate-100');
  content = content.replace(/text-slate-700/g, 'text-slate-200');
  content = content.replace(/text-slate-600/g, 'text-slate-300');
  content = content.replace(/text-slate-500/g, 'text-slate-400');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(sectionsDir);
walkDir(pagesDir);
