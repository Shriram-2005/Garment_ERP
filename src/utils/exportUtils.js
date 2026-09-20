import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDFReport = (dataMap, tablesConfig, isComplete = true, includeOverview = false) => {
  const doc = new jsPDF();
  const indexMap = [];
  const shouldIncludeOverview = isComplete || includeOverview;
  
  let firstTable = true;

  tablesConfig.forEach((t) => {
    const data = dataMap[t.key] || [];

    if (!firstTable) {
      doc.addPage();
    }
    firstTable = false;

    // Track the current page number before we shift them later
    const pageNumber = doc.internal.getNumberOfPages();
    indexMap.push({ name: t.name, pageNumber });

    // Add Header
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(t.name.toUpperCase(), 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Records: ${data.length}`, 14, 26);

    if (data.length > 0) {
      const headers = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'created_at');
      const body = data.map(row => headers.map(h => row[h] ? String(row[h]) : ""));

      autoTable(doc, {
        startY: 32,
        head: [headers.map(h => h.toUpperCase())],
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3, textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text("No records found in this range.", 14, 40);
    }
  });

  // Now that all tables are drawn, we prepend pages for the Index and Overview
  const pagesToInsert = shouldIncludeOverview ? 2 : 1;
  
  // Important: Insert blank pages at the very beginning (page 1)
  for (let i = 0; i < pagesToInsert; i++) {
    doc.insertPage(1);
  }

  // --- DRAW INDEX (Always on Page 1) ---
  doc.setPage(1);
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text(isComplete ? "GARMENT ERP - MASTER REPORT" : "GARMENT ERP - CUSTOM REPORT", 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(212, 175, 55);
  doc.line(14, 32, 196, 32);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("INDEX", 14, 45);

  const indexBody = indexMap.map((item, i) => [`${i + 1}. ${item.name}`, `Page ${item.pageNumber + pagesToInsert}`]);
  
  autoTable(doc, {
    startY: 50,
    body: indexBody,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2.5, textColor: [0, 0, 0] },
    columnStyles: { 
      0: { cellWidth: 'auto' }, 
      1: { cellWidth: 30, halign: 'right', fontStyle: 'bold' } 
    }
  });

  // --- DRAW OVERVIEW (Page 2) ---
  if (shouldIncludeOverview) {
    doc.setPage(2);
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("DASHBOARD OVERVIEW", 14, 20);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(212, 175, 55);
    doc.line(14, 24, 196, 24);

    const overviewMetrics = [];
    if (dataMap['erp_master']) overviewMetrics.push(["Total Product Styles", dataMap['erp_master'].length]);
    if (dataMap['erp_sales']) overviewMetrics.push(["Total Sales Orders", dataMap['erp_sales'].length]);
    if (dataMap['erp_fabric']) overviewMetrics.push(["Fabric Stock Entries", dataMap['erp_fabric'].length]);
    if (dataMap['erp_purchase']) overviewMetrics.push(["Purchase Orders", dataMap['erp_purchase'].length]);
    if (dataMap['erp_planning']) overviewMetrics.push(["Production Plans", dataMap['erp_planning'].length]);
    if (dataMap['erp_finished']) overviewMetrics.push(["Finished Goods Batches", dataMap['erp_finished'].length]);

    if (overviewMetrics.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text("No overview metrics available for selected modules.", 14, 35);
    } else {
      autoTable(doc, {
        startY: 30,
        head: [["METRIC", "TOTAL COUNT"]],
        body: overviewMetrics,
        theme: 'grid',
        headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 12, cellPadding: 5, textColor: [50, 50, 50] },
      });
    }
  }

  doc.save(isComplete ? "erp_full_report.pdf" : "erp_custom_report.pdf");
};
