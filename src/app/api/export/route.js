import { createClient } from '@/utils/supabase/server';
import * as XLSX from 'xlsx-js-style';

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Fetch all 19 tables in parallel
    const tables = [
      'erp_master', 'erp_matrix', 'erp_bom', 'erp_costing',
      'erp_fabric', 'erp_accessories', 'erp_purchase',
      'erp_sales', 'erp_mrp', 'erp_planning',
      'erp_cutting', 'erp_bundle', 'erp_stitching', 'erp_jobwork', 'erp_finishing',
      'erp_quality', 'erp_packing', 'erp_finished', 'erp_dispatch'
    ];

    const results = await Promise.all(
      tables.map(table => supabase.from(table).select('*'))
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

    // ---------------------------------------------------------
    // SHEET 1: Dashboard (Aggregates)
    // ---------------------------------------------------------
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
    const dashMetrics = [
      ["Total Product Styles", dataMap['erp_master'].length],
      ["Total Sales Orders", dataMap['erp_sales'].length],
      ["Fabric Stock Entries", dataMap['erp_fabric'].length],
      ["Purchase Orders", dataMap['erp_purchase'].length],
      ["Production Plans", dataMap['erp_planning'].length],
      ["Finished Goods Batches", dataMap['erp_finished'].length]
    ];

    dashMetrics.forEach((m, r) => {
      const isBottom = r === dashMetrics.length - 1;
      dashAoa.push([
        { v: m[0], t: 's', s: { border: getBorderStyle(false, isBottom, true, false) } },
        { v: String(m[1]), t: 's', s: { border: getBorderStyle(false, isBottom, false, true) } }
      ]);
    });

    const wsDash = XLSX.utils.aoa_to_sheet(dashAoa);
    XLSX.utils.book_append_sheet(wb, formatSheet(wsDash, dashMerges), "Dashboard");

    // ---------------------------------------------------------
    // SHEET 2: Product Engineering
    // ---------------------------------------------------------
    const prodAoa = [];
    const prodMerges = [];
    appendTableToAoa(prodAoa, prodMerges, "PRODUCT MASTER", dataMap['erp_master']);
    appendTableToAoa(prodAoa, prodMerges, "SIZE & COLOUR MATRIX", dataMap['erp_matrix']);
    appendTableToAoa(prodAoa, prodMerges, "BILL OF MATERIALS", dataMap['erp_bom']);
    appendTableToAoa(prodAoa, prodMerges, "COSTING", dataMap['erp_costing']);
    XLSX.utils.book_append_sheet(wb, formatSheet(XLSX.utils.aoa_to_sheet(prodAoa), prodMerges), "Product Engineering");

    // ---------------------------------------------------------
    // SHEET 3: Inventory & Sourcing
    // ---------------------------------------------------------
    const invAoa = [];
    const invMerges = [];
    appendTableToAoa(invAoa, invMerges, "FABRIC STOCK", dataMap['erp_fabric']);
    appendTableToAoa(invAoa, invMerges, "TRIMS & ACCESSORIES", dataMap['erp_accessories']);
    appendTableToAoa(invAoa, invMerges, "PURCHASE ORDERS", dataMap['erp_purchase']);
    XLSX.utils.book_append_sheet(wb, formatSheet(XLSX.utils.aoa_to_sheet(invAoa), invMerges), "Inventory & Sourcing");

    // ---------------------------------------------------------
    // SHEET 4: Sales & Planning
    // ---------------------------------------------------------
    const salesAoa = [];
    const salesMerges = [];
    appendTableToAoa(salesAoa, salesMerges, "SALES ORDERS", dataMap['erp_sales']);
    appendTableToAoa(salesAoa, salesMerges, "MRP", dataMap['erp_mrp']);
    appendTableToAoa(salesAoa, salesMerges, "PRODUCTION PLANNING", dataMap['erp_planning']);
    XLSX.utils.book_append_sheet(wb, formatSheet(XLSX.utils.aoa_to_sheet(salesAoa), salesMerges), "Sales & Planning");

    // ---------------------------------------------------------
    // SHEET 5: Production Floor
    // ---------------------------------------------------------
    const floorAoa = [];
    const floorMerges = [];
    appendTableToAoa(floorAoa, floorMerges, "CUTTING", dataMap['erp_cutting']);
    appendTableToAoa(floorAoa, floorMerges, "BUNDLE MGMT", dataMap['erp_bundle']);
    appendTableToAoa(floorAoa, floorMerges, "SEWING (STITCHING)", dataMap['erp_stitching']);
    appendTableToAoa(floorAoa, floorMerges, "EXTERNAL JOB WORK", dataMap['erp_jobwork']);
    appendTableToAoa(floorAoa, floorMerges, "FINISHING", dataMap['erp_finishing']);
    XLSX.utils.book_append_sheet(wb, formatSheet(XLSX.utils.aoa_to_sheet(floorAoa), floorMerges), "Production Floor");

    // ---------------------------------------------------------
    // SHEET 6: Logistics & QA
    // ---------------------------------------------------------
    const logAoa = [];
    const logMerges = [];
    appendTableToAoa(logAoa, logMerges, "QUALITY INSPECTION", dataMap['erp_quality']);
    appendTableToAoa(logAoa, logMerges, "PACKING", dataMap['erp_packing']);
    appendTableToAoa(logAoa, logMerges, "FINISHED GOODS", dataMap['erp_finished']);
    appendTableToAoa(logAoa, logMerges, "DISPATCH LOGISTICS", dataMap['erp_dispatch']);
    XLSX.utils.book_append_sheet(wb, formatSheet(XLSX.utils.aoa_to_sheet(logAoa), logMerges), "Logistics & QA");

    // Generate buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Return response as downloadable file
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="erp_full_report.xlsx"',
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
