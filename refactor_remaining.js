const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app', '(app)');

const manuallyRefactored = ['dashboard', 'master', 'fabric', 'accessories', 'bom'];

const dirs = fs.readdirSync(appDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !manuallyRefactored.includes(dirent.name))
  .map(dirent => dirent.name);

// Define standard schemas and icons/titles based on module name
const moduleConfig = {
  sales: { icon: 'storefront', title: 'Sales Orders', schema: `[{ key: 'orderId', label: 'Order ID' }, { key: 'buyer', label: 'Buyer' }, { key: 'qty', label: 'Quantity', type: 'number' }]` },
  mrp: { icon: 'precision_manufacturing', title: 'Material Requirement', schema: `[{ key: 'planId', label: 'Plan ID' }, { key: 'status', label: 'Status' }]` },
  costing: { icon: 'payments', title: 'Costing', schema: `[{ key: 'styleCode', label: 'Style Code' }, { key: 'totalCost', label: 'Total Cost ($)', type: 'number' }]` },
  cutting: { icon: 'content_cut', title: 'Cutting', schema: `[{ key: 'jobId', label: 'Job ID' }, { key: 'cutQty', label: 'Cut Quantity', type: 'number' }]` },
  bundle: { icon: 'qr_code_2', title: 'Bundle Management', schema: `[{ key: 'bundleId', label: 'Bundle ID' }, { key: 'size', label: 'Size' }, { key: 'pcs', label: 'Pieces', type: 'number' }]` },
  stitching: { icon: 'format_line_spacing', title: 'Sewing / Stitching', schema: `[{ key: 'lineNo', label: 'Line Number' }, { key: 'outputQty', label: 'Output Qty', type: 'number' }]` },
  quality: { icon: 'fact_check', title: 'Quality Control', schema: `[{ key: 'inspectionId', label: 'Inspection ID' }, { key: 'passQty', label: 'Passed Qty', type: 'number' }, { key: 'failQty', label: 'Failed Qty', type: 'number' }]` },
  packing: { icon: 'inventory', title: 'Packing', schema: `[{ key: 'cartonNo', label: 'Carton No' }, { key: 'contents', label: 'Contents' }]` },
  dispatch: { icon: 'local_shipping', title: 'Dispatch', schema: `[{ key: 'invoiceNo', label: 'Invoice No' }, { key: 'destination', label: 'Destination' }]` },
  finished: { icon: 'warehouse', title: 'Finished Goods', schema: `[{ key: 'style', label: 'Style' }, { key: 'totalStock', label: 'Total Stock', type: 'number' }]` },
  jobwork: { icon: 'engineering', title: 'Job Work', schema: `[{ key: 'challanNo', label: 'Challan No' }, { key: 'contractor', label: 'Contractor Name' }]` },
  planning: { icon: 'calendar_month', title: 'Production Planning', schema: `[{ key: 'planId', label: 'Plan ID' }, { key: 'startDate', label: 'Start Date', type: 'date' }]` },
  purchase: { icon: 'shopping_cart', title: 'Purchase Orders', schema: `[{ key: 'poNumber', label: 'PO Number' }, { key: 'vendor', label: 'Vendor' }, { key: 'amount', label: 'Amount ($)', type: 'number' }]` },
  finishing: { icon: 'dry_cleaning', title: 'Finishing', schema: `[{ key: 'batchId', label: 'Batch ID' }, { key: 'status', label: 'Status' }]` },
  matrix: { icon: 'grid_on', title: 'Size & Colour Matrix', schema: `[{ key: 'styleCode', label: 'Style Code' }, { key: 'color', label: 'Color' }, { key: 'size', label: 'Size' }]` }
};

dirs.forEach(dir => {
  const pagePath = path.join(appDir, dir, 'page.js');
  if (fs.existsSync(pagePath)) {
    
    const config = moduleConfig[dir] || { icon: 'folder', title: dir.charAt(0).toUpperCase() + dir.slice(1), schema: `[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }]` };
    
    const content = `"use client";

import DataTable from "@/components/DataTable";

export default function ${dir.charAt(0).toUpperCase() + dir.slice(1)}Module() {
  const schema = ${config.schema};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>${config.icon}</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>${config.title}</h1>
        </div>
      </div>

      <DataTable 
        moduleName="${dir}" 
        schema={schema} 
        title="${config.title} Records" 
      />
    </div>
  );
}
`;

    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`Updated ${dir}/page.js`);
  }
});

console.log("All remaining modules updated to use DataTable!");
