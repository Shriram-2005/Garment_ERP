const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');
const appGroup = path.join(srcApp, '(app)');
const marketingGroup = path.join(srcApp, '(marketing)');
const loginGroup = path.join(marketingGroup, 'login');
const dashboardGroup = path.join(appGroup, 'dashboard');

// Create directories
[appGroup, marketingGroup, loginGroup, dashboardGroup].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const modules = [
  "accessories", "bom", "bundle", "costing", "cutting", "dispatch", 
  "fabric", "finished", "finishing", "jobwork", "master", "matrix", 
  "mrp", "packing", "planning", "purchase", "quality", "sales", "stitching"
];

// Move modules to (app)
modules.forEach(mod => {
  const oldPath = path.join(srcApp, mod);
  const newPath = path.join(appGroup, mod);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
});

// Move page.js to dashboard
if (fs.existsSync(path.join(srcApp, 'page.js'))) {
  fs.renameSync(path.join(srcApp, 'page.js'), path.join(dashboardGroup, 'page.js'));
}

// Move ClientLayout.js to (app)/layout.js
if (fs.existsSync(path.join(srcApp, 'ClientLayout.js'))) {
  fs.renameSync(path.join(srcApp, 'ClientLayout.js'), path.join(appGroup, 'layout.js'));
}

// Rename login page to (marketing)/login/page.js
if (fs.existsSync(path.join(srcApp, 'login.js'))) {
  fs.renameSync(path.join(srcApp, 'login.js'), path.join(loginGroup, 'page.js'));
}

console.log("Moved successfully.");
