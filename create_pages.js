const fs = require('fs');
const path = require('path');

const modules = [
  { name: "Product / Style Master", path: "master", icon: "checkroom", cols: ["Style Code", "Category", "Season"], data: [["TS-01", "T-Shirt", "Summer"], ["TP-02", "Track Pant", "Winter"]] },
  { name: "Size & Colour Matrix", path: "matrix", icon: "grid_on", cols: ["Style", "Color", "Sizes Available"], data: [["TS-01", "Navy", "S, M, L, XL"], ["TP-02", "Black", "M, L, XXL"]] },
  { name: "Fabric Inventory", path: "fabric", icon: "inventory_2", cols: ["Roll No", "GSM", "Color", "Available (m)"], data: [["R-1001", "180", "Navy", "500"], ["R-1002", "220", "Black", "300"]] },
  { name: "Accessories Inventory", path: "accessories", icon: "category", cols: ["Item", "Type", "Stock"], data: [["Thread-Blk", "Thread", "50 Cones"], ["Btn-Wht", "Button", "5000 Pcs"]] },
  { name: "Purchase Management", path: "purchase", icon: "shopping_cart", cols: ["PO Number", "Supplier", "Status"], data: [["PO-991", "Fabric Co.", "Delivered"], ["PO-992", "Trims Inc.", "Pending"]] },
  { name: "Bill of Materials (BOM)", path: "bom", icon: "receipt_long", cols: ["Style Code", "Fabric Req.", "Accessories"], data: [["TS-01", "1.2m / pc", "1 Label, 1 Tag"], ["TP-02", "1.5m / pc", "Elastic, Drawstring"]] },
  { name: "Costing", path: "costing", icon: "payments", cols: ["Style", "Material Cost", "Total Mfg Cost"], data: [["TS-01", "$2.50", "$3.80"], ["TP-02", "$4.00", "$5.50"]] },
  { name: "Sales / Buyer Order", path: "sales", icon: "storefront", cols: ["Order ID", "Buyer", "Delivery Date"], data: [["ORD-001", "Retail Brand X", "Oct 15, 2026"], ["ORD-002", "Sports Y", "Nov 01, 2026"]] },
  { name: "Material Requirement (MRP)", path: "mrp", icon: "precision_manufacturing", cols: ["Plan ID", "Material Shortage", "Action"], data: [["MRP-01", "None", "Ready"], ["MRP-02", "Navy Thread", "Raise PO"]] },
  { name: "Production Planning", path: "planning", icon: "calendar_month", cols: ["Prod. Order", "Line", "Target Qty"], data: [["PRD-001", "Line 1", "2000"], ["PRD-002", "Line 3", "1500"]] },
  { name: "Cutting Management", path: "cutting", icon: "content_cut", cols: ["Lay ID", "Fabric Issued", "Wastage"], data: [["LAY-01", "400m", "2.5%"], ["LAY-02", "250m", "1.8%"]] },
  { name: "Bundle Management", path: "bundle", icon: "qr_code_2", cols: ["Bundle ID", "Size", "Qty"], data: [["B-101", "M", "50"], ["B-102", "L", "50"]] },
  { name: "Stitching / Sewing", path: "stitching", icon: "format_line_spacing", cols: ["Line", "Hourly Output", "Efficiency"], data: [["Line 1", "150 pcs", "82%"], ["Line 2", "130 pcs", "75%"]] },
  { name: "Job Work Management", path: "jobwork", icon: "engineering", cols: ["Challan", "Vendor", "Process"], data: [["JW-55", "PrintShop A", "Chest Print"], ["JW-56", "WashPro", "Garment Wash"]] },
  { name: "Finishing Management", path: "finishing", icon: "dry_cleaning", cols: ["Batch", "Process", "Passed Qty"], data: [["FIN-1", "Ironing", "1200"], ["FIN-2", "Folding", "1150"]] },
  { name: "Quality Control", path: "quality", icon: "fact_check", cols: ["Inspection ID", "Stage", "Rejection %"], data: [["QC-01", "Inline", "1.2%"], ["QC-02", "Final", "0.5%"]] },
  { name: "Packing Management", path: "packing", icon: "inventory", cols: ["Carton No", "Style", "Pcs/Carton"], data: [["C-001", "TS-01", "100"], ["C-002", "TP-02", "50"]] },
  { name: "Finished Goods Inventory", path: "finished", icon: "warehouse", cols: ["Style", "Color", "Stock Qty"], data: [["TS-01", "Navy", "4500"], ["TP-02", "Black", "2000"]] },
  { name: "Dispatch & Shipment", path: "dispatch", icon: "local_shipping", cols: ["Invoice", "Transporter", "Tracking"], data: [["INV-101", "Logistics A", "In Transit"], ["INV-102", "Express B", "Delivered"]] }
];

const basePath = path.join(__dirname, 'src', 'app');

modules.forEach(mod => {
  const dirPath = path.join(basePath, mod.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const fileContent = `"use client";

export default function ${mod.path.charAt(0).toUpperCase() + mod.path.slice(1)}Module() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)' }}>${mod.icon}</span>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>${mod.name}</h1>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>Module Data</h2>
          <button className="btn">
            <span className="material-symbols-outlined">add</span>
            Add New Record
          </button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                ${mod.cols.map(c => `<th>${c}</th>`).join('')}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${mod.data.map((row, i) => `
              <tr key="${i}">
                ${row.map(cell => `<td>${cell}</td>`).join('')}
                <td>
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                </td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.js'), fileContent);
});

console.log('All module pages created successfully.');
