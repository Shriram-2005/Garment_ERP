const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app', '(app)');

const dirs = fs.readdirSync(appDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

dirs.forEach(dir => {
  const pagePath = path.join(appDir, dir, 'page.js');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');

    // Remove the fontFamily style property
    content = content.replace(/fontFamily:\s*"'Playfair Display', serif",?\s*/g, '');
    
    // Sometimes there might be a comma issue if it was at the end of an object, but our formatting was:
    // fontFamily: "'Playfair Display', serif", fontSize: '3rem'...
    // So removing it and the trailing comma+space should be fine.

    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`Updated ${dir}/page.js`);
  }
});

console.log("All modules updated to remove style font!");
