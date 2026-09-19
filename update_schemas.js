const fs = require('fs');
const path = require('path');

const moduleConfigs = {
  master: `(record) => record.status === 'Draft' ? [{ label: 'Approve', status: 'Active', icon: 'check_circle', successMsg: 'Style Approved' }] : record.status === 'Active' ? [{ label: 'Archive', status: 'Archived', icon: 'archive', successMsg: 'Style Archived' }] : []`,
  matrix: `(record) => record.status === 'Draft' ? [{ label: 'Lock Matrix', status: 'Locked', icon: 'lock', successMsg: 'Matrix Locked' }] : []`,
  bom: `(record) => record.status === 'Draft' ? [{ label: 'Approve', status: 'Approved', icon: 'check_circle', successMsg: 'BOM Approved' }] : record.status === 'Approved' ? [{ label: 'Lock', status: 'Locked', icon: 'lock', successMsg: 'BOM Locked' }] : []`,
  costing: `(record) => record.status === 'Pending' ? [{ label: 'Approve', status: 'Approved', icon: 'check_circle', successMsg: 'Costing Approved' }] : []`,
  fabric: `(record) => record.status === 'In Stock' ? [{ label: 'Mark Low Stock', status: 'Low Stock', icon: 'warning', successMsg: 'Marked Low Stock' }, { label: 'Mark Out of Stock', status: 'Out of Stock', icon: 'block', successMsg: 'Marked Out of Stock' }] : record.status === 'Low Stock' ? [{ label: 'Restock', status: 'In Stock', icon: 'inventory', successMsg: 'Restocked' }, { label: 'Mark Out of Stock', status: 'Out of Stock', icon: 'block', successMsg: 'Marked Out of Stock' }] : [{ label: 'Restock', status: 'In Stock', icon: 'inventory', successMsg: 'Restocked' }]`,
  accessories: `(record) => record.status === 'In Stock' ? [{ label: 'Mark Low Stock', status: 'Low Stock', icon: 'warning', successMsg: 'Marked Low Stock' }, { label: 'Mark Out of Stock', status: 'Out of Stock', icon: 'block', successMsg: 'Marked Out of Stock' }] : record.status === 'Low Stock' ? [{ label: 'Restock', status: 'In Stock', icon: 'inventory', successMsg: 'Restocked' }, { label: 'Mark Out of Stock', status: 'Out of Stock', icon: 'block', successMsg: 'Marked Out of Stock' }] : [{ label: 'Restock', status: 'In Stock', icon: 'inventory', successMsg: 'Restocked' }]`,
  purchase: `(record) => record.status === 'Draft' ? [{ label: 'Send to Vendor', status: 'Sent', icon: 'send', successMsg: 'PO Sent' }] : record.status === 'Sent' ? [{ label: 'Mark Received', status: 'Received', icon: 'inventory', successMsg: 'Goods Received' }] : []`,
  sales: `(record) => record.status === 'Pending Material' ? [{ label: 'Confirm Order', status: 'Confirmed', icon: 'check_circle', successMsg: 'Order Confirmed' }] : record.status === 'Confirmed' ? [{ label: 'Start Production', status: 'In Production', icon: 'factory', successMsg: 'Production Started' }] : record.status === 'In Production' ? [{ label: 'Complete Order', status: 'Finished Goods', icon: 'task_alt', successMsg: 'Order Completed' }] : []`,
  mrp: `(record) => record.status === 'Draft' ? [{ label: 'Submit for Approval', status: 'Pending Approval', icon: 'schedule', successMsg: 'Submitted for Approval' }] : record.status === 'Pending Approval' ? [{ label: 'Approve Plan', status: 'Approved', icon: 'check_circle', successMsg: 'Plan Approved' }] : []`,
  planning: `(record) => record.status === 'Draft' ? [{ label: 'Start Production', status: 'In Progress', icon: 'play_arrow', successMsg: 'Production Started' }] : record.status === 'In Progress' ? [{ label: 'Complete Plan', status: 'Completed', icon: 'task_alt', successMsg: 'Plan Completed' }] : []`,
  cutting: `(record) => record.status === 'Pending' ? [{ label: 'Start Cutting', status: 'In Progress', icon: 'content_cut', successMsg: 'Cutting Started' }] : record.status === 'In Progress' ? [{ label: 'Complete Job', status: 'Completed', icon: 'task_alt', successMsg: 'Cutting Completed' }] : []`,
  bundle: `(record) => record.status === 'Generated' ? [{ label: 'Dispatch to Sewing', status: 'Dispatched', icon: 'local_shipping', successMsg: 'Dispatched to Sewing' }] : []`,
  stitching: `(record) => record.status === 'In Progress' ? [{ label: 'Complete Output', status: 'Completed', icon: 'task_alt', successMsg: 'Stitching Completed' }] : []`,
  jobwork: `(record) => record.status === 'Dispatched' ? [{ label: 'Receive Goods', status: 'Received', icon: 'inventory', successMsg: 'Goods Received' }] : []`,
  finishing: `(record) => record.status === 'Washing' ? [{ label: 'Move to Ironing', status: 'Ironing', icon: 'iron', successMsg: 'Moved to Ironing' }] : record.status === 'Ironing' ? [{ label: 'Move to Folded', status: 'Folded', icon: 'checkroom', successMsg: 'Folded' }] : []`,
  quality: `(record) => record.status === 'Pending' ? [{ label: 'Pass Inspection', status: 'Passed', icon: 'verified', successMsg: 'Passed QA' }, { label: 'Fail Inspection', status: 'Failed', icon: 'cancel', successMsg: 'Failed QA' }] : record.status === 'Failed' ? [{ label: 'Rework Done', status: 'Passed', icon: 'verified', successMsg: 'Passed QA after rework' }] : []`,
  packing: `(record) => record.status === 'Pending' ? [{ label: 'Seal Carton', status: 'Sealed', icon: 'inventory_2', successMsg: 'Carton Sealed' }] : record.status === 'Sealed' ? [{ label: 'Mark Ready', status: 'Ready for Dispatch', icon: 'local_shipping', successMsg: 'Ready for Dispatch' }] : []`,
  finished: `(record) => record.status === 'In Stock' ? [{ label: 'Transfer to Retail', status: 'Transferred', icon: 'storefront', successMsg: 'Transferred to Retail' }, { label: 'Mark Sold Out', status: 'Sold Out', icon: 'remove_shopping_cart', successMsg: 'Marked Sold Out' }] : record.status === 'Transferred' ? [{ label: 'Mark Sold Out', status: 'Sold Out', icon: 'remove_shopping_cart', successMsg: 'Marked Sold Out' }] : []`,
  dispatch: `(record) => record.status === 'Pending' ? [{ label: 'Ship Invoice', status: 'Shipped', icon: 'flight_takeoff', successMsg: 'Shipped' }] : record.status === 'Shipped' ? [{ label: 'Mark Delivered', status: 'Delivered', icon: 'where_to_vote', successMsg: 'Delivered' }] : []`
};

const basePath = path.join(__dirname, 'src', 'app', '(app)');

Object.keys(moduleConfigs).forEach(moduleName => {
  const filePath = path.join(basePath, moduleName, 'page.js');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add status to schema if not present
    if (!content.includes('{ key: "status"')) {
      const idx = content.lastIndexOf('];');
      if (idx !== -1) {
        content = content.substring(0, idx) + '    , { key: "status", label: "Status", type: "text" }\n  ' + content.substring(idx);
      }
    }
    
    // Check if customActions is already there
    if (!content.includes('customActions=')) {
      // Find DataTable closing tag and replace it
      content = content.split('/>').join('  customActions={' + moduleConfigs[moduleName] + '}\n      />');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Updated " + moduleName + "/page.js");
  } else {
    console.log("File not found: " + filePath);
  }
});
