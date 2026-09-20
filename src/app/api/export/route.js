import { createClient } from '@/utils/supabase/server';
import * as XLSX from 'xlsx-js-style';

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const modulesParam = searchParams.get('modules'); // comma separated
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const includeOverview = searchParams.get('overview') !== 'false'; // default true

    const allTables = [
      'erp_master', 'erp_matrix', 'erp_bom', 'erp_costing',
      'erp_fabric', 'erp_accessories', 'erp_purchase',
      'erp_sales', 'erp_mrp', 'erp_planning',
      'erp_cutting', 'erp_bundle', 'erp_stitching', 'erp_jobwork', 'erp_finishing',
      'erp_quality', 'erp_packing', 'erp_finished', 'erp_dispatch'
    ];

    const tables = modulesParam ? modulesParam.split(',') : allTables;

    const results = await Promise.all(
      tables.map(table => {
        let query = supabase.from(table).select('*');
        if (fromDate) query = query.gte('created_at', fromDate);
        if (toDate) query = query.lte('created_at', toDate);
        return query;
      })
    );

    const dataMap = {};
    tables.forEach((table, index) => {
      dataMap[table] = results[index].data || [];
    });

    const wb = XLSX.utils.book_new();

    // Reusable styles
    const titleStyle = {
      font: { bold: true, sz: 14, color: { rgb: "000000" } },
      alignment: { vertical: "center", horizontal: "center" }
    };

    const getBorderStyle = (isTop, isBottom, isLeft, isRight) => ({
      top: { style: isTop ? "thick" : "thin", color: { rgb: "000000" } },
      bottom: { style: isBottom ? "thick" : "thin", color: { rgb: "000000" } },
      left: { style: isLeft ? "thick" : "thin", color: { rgb: "000000" } },
      right: { style: isRight ? "thick" : "thin", color: { rgb: "000000" } }
    });

    // Helper to add a section (sub-module) to an array of arrays (AOA)
    const appendTableToAoa = (aoa, merges, title, data) => {
      const startRow = aoa.length;

      let numCols = 5; // Default if empty
      let headers = [];
      if (data && data.length > 0) {
        headers = Object.keys(data[0]).filter(key => key !== 'id' && key !== 'created_at');
        numCols = headers.length;
      }

      // Add Title row as simple centered text across the table width
      const titleRow = [];
      for (let c = 0; c < numCols; c++) {
        titleRow.push({
          v: c === 0 ? title : "",
          t: 's',
          s: titleStyle
        });
      }
      aoa.push(titleRow);
      
      // Merge title exactly to the table width
      merges.push({ s: { r: startRow, c: 0 }, e: { r: startRow, c: Math.max(0, numCols - 1) } });
      
      // Blank row between title and table
      aoa.push([]);

      if (data && data.length > 0) {

        // Map headers to styled cells (thick outside border for the header row)
        aoa.push(headers.map((h, c) => ({
          v: h.toUpperCase(),
          t: 's',
          s: {
            font: { bold: true, color: { rgb: "000000" } },
            fill: { fgColor: { rgb: "D4AF37" } },
            border: getBorderStyle(true, true, c === 0, c === numCols - 1)
          }
        })));

        // Extract rows with standard cell styling but thick borders on the table edges
        const numRows = data.length;
        data.forEach((row, r) => {
          const isBottomRow = r === numRows - 1;
          aoa.push(headers.map((h, c) => ({
            v: row[h] !== null && row[h] !== undefined ? String(row[h]) : "",
            t: 's',
            s: { border: getBorderStyle(false, isBottomRow, c === 0, c === numCols - 1) }
          })));
        });
      } else {
        aoa.push([{ v: "No records found.", t: 's', s: { font: { italic: true } } }]);
      }
      aoa.push([]); // Empty row for spacing
      aoa.push([]); // Double empty row
    };

    const formatSheet = (ws, merges) => {
      ws['!cols'] = Array(20).fill({ wch: 20 }); // Set base column width
      if (merges && merges.length > 0) {
        ws['!merges'] = merges;
      }
      return ws;
    };

    // Helper function to check if a table was requested
    const isRequested = (tableName) => tables.includes(tableName);

    // ---------------------------------------------------------
    // SHEET 1: Dashboard (Aggregates) - Always include, but only show requested metrics
    // ---------------------------------------------------------
    if (includeOverview) {
      const dashAoa = [
        [
          { v: "OVERVIEW", t: 's', s: titleStyle },
          { v: "", t: 's', s: titleStyle }
        ],
        [],
        [
          { v: "METRIC", t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "D4AF37" } }, border: getBorderStyle(true, true, true, false) } },
          { v: "TOTAL COUNT", t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "D4AF37" } }, border: getBorderStyle(true, true, false, true) } }
        ]
      ];

      const dashMerges = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
      const allDashMetrics = [
        { label: "Total Product Styles", table: "erp_master" },
        { label: "Total Sales Orders", table: "erp_sales" },
        { label: "Fabric Stock Entries", table: "erp_fabric" },
        { label: "Purchase Orders", table: "erp_purchase" },
        { label: "Production Plans", table: "erp_planning" },
        { label: "Finished Goods Batches", table: "erp_finished" }
      ];

      // Only include metrics for tables that were actually requested
      const requestedDashMetrics = allDashMetrics.filter(m => isRequested(m.table));
      
      if (requestedDashMetrics.length > 0) {
        requestedDashMetrics.forEach((m, r) => {
          const isBottom = r === requestedDashMetrics.length - 1;
          dashAoa.push([
            { v: m.label, t: 's', s: { border: getBorderStyle(false, isBottom, true, false) } },
            { v: String((dataMap[m.table] || []).length), t: 's', s: { border: getBorderStyle(false, isBottom, false, true) } }
          ]);
        });
        const wsDash = XLSX.utils.aoa_to_sheet(dashAoa);
        XLSX.utils.book_append_sheet(wb, formatSheet(wsDash, dashMerges), "Dashboard");
      }
    }

    // Helper to generate a category sheet
    const addCategorySheet = (sheetName, modulesConfig) => {
      const activeModules = modulesConfig.filter(m => isRequested(m.table));
      if (activeModules.length === 0) return; // Skip entirely if no modules in this category were requested

      const aoa = [];
      const merges = [];
      activeModules.forEach(m => {
        appendTableToAoa(aoa, merges, m.title, dataMap[m.table]);
      });
      XLSX.utils.book_append_sheet(wb, formatSheet(XLSX.utils.aoa_to_sheet(aoa), merges), sheetName);
    };

    // ---------------------------------------------------------
    // SHEET 2: Product Engineering
    // ---------------------------------------------------------
    addCategorySheet("Product Engineering", [
      { title: "PRODUCT MASTER", table: 'erp_master' },
      { title: "SIZE & COLOUR MATRIX", table: 'erp_matrix' },
      { title: "BILL OF MATERIALS", table: 'erp_bom' },
      { title: "COSTING", table: 'erp_costing' }
    ]);

    // ---------------------------------------------------------
    // SHEET 3: Inventory & Sourcing
    // ---------------------------------------------------------
    addCategorySheet("Inventory & Sourcing", [
      { title: "FABRIC STOCK", table: 'erp_fabric' },
      { title: "TRIMS & ACCESSORIES", table: 'erp_accessories' },
      { title: "PURCHASE ORDERS", table: 'erp_purchase' }
    ]);

    // ---------------------------------------------------------
    // SHEET 4: Sales & Planning
    // ---------------------------------------------------------
    addCategorySheet("Sales & Planning", [
      { title: "SALES ORDERS", table: 'erp_sales' },
      { title: "MRP", table: 'erp_mrp' },
      { title: "PRODUCTION PLANNING", table: 'erp_planning' }
    ]);

    // ---------------------------------------------------------
    // SHEET 5: Production Floor
    // ---------------------------------------------------------
    addCategorySheet("Production Floor", [
      { title: "CUTTING", table: 'erp_cutting' },
      { title: "BUNDLE MGMT", table: 'erp_bundle' },
      { title: "SEWING (STITCHING)", table: 'erp_stitching' },
      { title: "EXTERNAL JOB WORK", table: 'erp_jobwork' },
      { title: "FINISHING", table: 'erp_finishing' }
    ]);

    // ---------------------------------------------------------
    // SHEET 6: Logistics & QA
    // ---------------------------------------------------------
    addCategorySheet("Logistics & QA", [
      { title: "QUALITY INSPECTION", table: 'erp_quality' },
      { title: "PACKING", table: 'erp_packing' },
      { title: "FINISHED GOODS", table: 'erp_finished' },
      { title: "DISPATCH LOGISTICS", table: 'erp_dispatch' }
    ]);

    // Generate buffer as Uint8Array to prevent corruption in Response
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });

    // Return response as downloadable file
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="erp_report.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });

  } catch (err) {
    console.error("Export Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
