const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = [
  path.join(__dirname, 'components'),
  path.join(__dirname, 'app')
];

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (fullPath.endsWith('.tsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = [];
for (const dir of DIRECTORIES_TO_SCAN) {
  scanDirectory(dir, allFiles);
}

let changedFilesCount = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // 1. Button Normalizations (Safe Button Padding Regexes)
  // Look for button-like padding (px-8 py-3 or px-10 py-4)
  // and inject sm: wrapper if it doesn't already have one
  
  // Replace px-10 py-4 -> px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base whitespace-nowrap
  newContent = newContent.replace(
    /className="([^"]*\b)px-10\s+py-4(\b[^"]*)"/g,
    (match, p1, p2) => {
      if (match.includes('sm:px-10')) return match; 
      let replacement = `className="${p1}px-6 sm:px-10 py-3 sm:py-4 text-[13px] sm:text-base whitespace-nowrap${p2}"`;
      return replacement;
    }
  );

  // Replace px-8 py-4 -> px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base whitespace-nowrap
  newContent = newContent.replace(
    /className="([^"]*\b)px-8\s+py-4(\b[^"]*)"/g,
    (match, p1, p2) => {
      if (match.includes('sm:px-8')) return match; 
      return `className="${p1}px-5 sm:px-8 py-3 sm:py-4 text-[13px] sm:text-base whitespace-nowrap${p2}"`;
    }
  );

  // Replace px-8 py-3 -> px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base whitespace-nowrap
  newContent = newContent.replace(
    /className="([^"]*\b)px-8\s+py-3(\b[^"]*)"/g,
    (match, p1, p2) => {
      if (match.includes('sm:px-8')) return match; 
      return `className="${p1}px-5 sm:px-8 py-2.5 sm:py-3 text-[13px] sm:text-base whitespace-nowrap${p2}"`;
    }
  );
  
  // Fix px-8 py-3.5
  newContent = newContent.replace(
    /className="([^"]*\b)px-8\s+py-3\.5(\b[^"]*)"/g,
    (match, p1, p2) => {
      if (match.includes('sm:px-8')) return match; 
      return `className="${p1}px-5 sm:px-8 py-3 sm:py-3.5 text-[13px] sm:text-base whitespace-nowrap${p2}"`;
    }
  );

  // 2. Typography Scaling 
  // Convert massive text to responsive steps
  
  // text-5xl md:text-6xl -> text-4xl md:text-5xl lg:text-6xl
  newContent = newContent.replace(/\btext-5xl\s+md:text-6xl\b/g, "text-4xl md:text-5xl lg:text-6xl");
  // text-5xl md:text-7xl -> text-4xl md:text-5xl lg:text-7xl
  newContent = newContent.replace(/\btext-5xl\s+md:text-7xl\b/g, "text-4xl md:text-6xl lg:text-7xl");
  // text-4xl md:text-5xl -> text-3xl md:text-4xl lg:text-5xl
  newContent = newContent.replace(/\btext-4xl\s+md:text-5xl\b/g, "text-3xl md:text-4xl lg:text-5xl");
  // Bare text-5xl -> text-3xl md:text-5xl
  newContent = newContent.replace(/className="([^"]*)\btext-5xl\b([^"]*)"/g, (match, p1, p2) => {
      if (match.includes('md:text-5xl') || match.includes('lg:text-5xl') || match.includes('sm:text-5xl')) return match;
      return `className="${p1}text-3xl md:text-5xl${p2}"`;
  });
  // Bare text-6xl -> text-4xl md:text-6xl
  newContent = newContent.replace(/className="([^"]*)\btext-6xl\b([^"]*)"/g, (match, p1, p2) => {
      if (match.includes('md:text-6xl') || match.includes('lg:text-6xl') || match.includes('sm:text-6xl')) return match;
      return `className="${p1}text-4xl md:text-6xl${p2}"`;
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFilesCount++;
    console.log(`Updated: ${path.relative(__dirname, file)}`);
  }
}

console.log(`\nSweep completed. Modifed ${changedFilesCount} files.`);
