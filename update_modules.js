const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app', '(app)');

const dirs = fs.readdirSync(appDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'dashboard')
  .map(dirent => dirent.name);

dirs.forEach(dir => {
  const pagePath = path.join(appDir, dir, 'page.js');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');

    // 1. Replace the top header div
    const topHeaderRegex = /<div style=\{\{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' \}\}>\s*<span className="material-symbols-outlined"[^>]*>([^<]+)<\/span>\s*<h1[^>]*>([^<]+)<\/h1>\s*<\/div>/;
    
    content = content.replace(topHeaderRegex, (match, icon, title) => {
      return `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>${icon}</span> Module</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: '400', margin: 0 }}>${title}</h1>
        </div>
      </div>`;
    });

    // 2. Replace the card header and button
    const cardHeaderRegex = /<div style=\{\{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' \}\}>\s*<h2[^>]*>([^<]+)<\/h2>\s*<button className="btn">\s*<span className="material-symbols-outlined">([^<]+)<\/span>\s*([^<]+)\s*<\/button>\s*<\/div>/;
    
    content = content.replace(cardHeaderRegex, (match, h2text, btnIcon, btnText) => {
      return `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: '400', margin: 0 }}>${h2text}</h2>
          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0A0A0A', 
            color: '#F8F8F8', 
            border: '1px solid #0A0A0A', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#0A0A0A'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.borderColor = '#0A0A0A'; e.currentTarget.style.color = '#F8F8F8'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>${btnIcon}</span>
            ${btnText.trim()}
          </button>
        </div>`;
    });

    // 3. Replace btn-outline inside tables
    content = content.replace(/className="btn-outline"/g, `style={{ background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}`);

    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`Updated ${dir}/page.js`);
  }
});

console.log("All modules updated!");
