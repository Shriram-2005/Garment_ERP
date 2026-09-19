-- ======================================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR GARMENT ERP (TEC THA)
-- Run this entire script in your Supabase SQL Editor
-- ======================================================================================

-- Drop tables if they exist to allow clean re-runs
DROP TABLE IF EXISTS erp_master CASCADE;
DROP TABLE IF EXISTS erp_fabric CASCADE;
DROP TABLE IF EXISTS erp_accessories CASCADE;
DROP TABLE IF EXISTS erp_bom CASCADE;
DROP TABLE IF EXISTS erp_costing CASCADE;
DROP TABLE IF EXISTS erp_sales CASCADE;
DROP TABLE IF EXISTS erp_mrp CASCADE;
DROP TABLE IF EXISTS erp_cutting CASCADE;
DROP TABLE IF EXISTS erp_bundle CASCADE;
DROP TABLE IF EXISTS erp_stitching CASCADE;
DROP TABLE IF EXISTS erp_quality CASCADE;
DROP TABLE IF EXISTS erp_packing CASCADE;
DROP TABLE IF EXISTS erp_dispatch CASCADE;
DROP TABLE IF EXISTS erp_finished CASCADE;
DROP TABLE IF EXISTS erp_jobwork CASCADE;
DROP TABLE IF EXISTS erp_planning CASCADE;
DROP TABLE IF EXISTS erp_purchase CASCADE;
DROP TABLE IF EXISTS erp_finishing CASCADE;
DROP TABLE IF EXISTS erp_matrix CASCADE;

-- 1. Master Styles
CREATE TABLE erp_master (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "styleCode" TEXT NOT NULL,
    category TEXT,
    season TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Fabric Inventory
CREATE TABLE erp_fabric (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    quantity TEXT,
    unit TEXT,
    cost TEXT,
    threshold TEXT DEFAULT '500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Accessories
CREATE TABLE erp_accessories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    quantity TEXT,
    unit TEXT,
    cost TEXT,
    threshold TEXT DEFAULT '500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Bill of Materials (BOM)
CREATE TABLE erp_bom (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    style TEXT,
    fabric TEXT,
    "fabricConsumption" TEXT,
    accessory TEXT,
    "accConsumption" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Costing
CREATE TABLE erp_costing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "styleCode" TEXT,
    "totalCost" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Sales Orders
CREATE TABLE erp_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "styleCode" TEXT,
    buyer TEXT,
    qty TEXT,
    "deliveryDate" TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. MRP
CREATE TABLE erp_mrp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "planId" TEXT NOT NULL,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Cutting Job
CREATE TABLE erp_cutting (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "orderId" TEXT,
    "cutQty" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Bundle Generation
CREATE TABLE erp_bundle (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    size TEXT,
    pcs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Stitching Output
CREATE TABLE erp_stitching (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "lineNo" TEXT NOT NULL,
    "orderId" TEXT,
    "outputQty" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Quality Inspection
CREATE TABLE erp_quality (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "inspectionId" TEXT NOT NULL,
    "orderId" TEXT,
    "passQty" TEXT,
    "failQty" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Packing
CREATE TABLE erp_packing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "cartonNo" TEXT NOT NULL,
    contents TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Dispatch Logistics
CREATE TABLE erp_dispatch (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "invoiceNo" TEXT NOT NULL,
    destination TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Finished Goods
CREATE TABLE erp_finished (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    style TEXT NOT NULL,
    "totalStock" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. External Jobwork
CREATE TABLE erp_jobwork (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "challanNo" TEXT NOT NULL,
    contractor TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Production Planning
CREATE TABLE erp_planning (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "startDate" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Purchase Orders
CREATE TABLE erp_purchase (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "poNumber" TEXT NOT NULL,
    vendor TEXT,
    amount TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Finishing Status
CREATE TABLE erp_finishing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "batchId" TEXT NOT NULL,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Size/Color Matrix
CREATE TABLE erp_matrix (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "styleCode" TEXT NOT NULL,
    color TEXT,
    size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================================================================================
-- SEED DATA (Records to Populate ALL Modules)
-- ======================================================================================

-- 1. Seeding Master Styles
INSERT INTO erp_master ("styleCode", category, season) VALUES
('TS-001', 'T-Shirt', 'Summer 2026'),
('TP-002', 'Track Pant', 'Winter 2026'),
('HD-003', 'Hoodie', 'Winter 2026'),
('JK-004', 'Jacket', 'Spring 2026'),
('DN-005', 'Denim Jeans', 'Fall 2026');

-- 2. Seeding Fabric Inventory
INSERT INTO erp_fabric (name, type, quantity, unit, cost, threshold) VALUES
('100% Cotton Single Jersey', 'Knit', '5000', 'Kgs', '4.50', '1000'),
('Fleece 300 GSM', 'Knit', '2500', 'Kgs', '5.20', '800'),
('Denim 12oz', 'Woven', '400', 'Yards', '3.80', '1500');

-- 3. Seeding Accessories
INSERT INTO erp_accessories (name, category, quantity, unit, cost, threshold) VALUES
('Care Label', 'Labels', '15000', 'Pcs', '0.05', '5000'),
('YKK Zipper 8 inch', 'Fasteners', '300', 'Pcs', '0.20', '1000'),
('Drawcord 1.2m', 'Trims', '10000', 'Pcs', '0.15', '2000');

-- 4. Seeding BOM
INSERT INTO erp_bom (style, fabric, "fabricConsumption", accessory, "accConsumption") VALUES
('TS-001', '100% Cotton Single Jersey', '0.25', 'Care Label', '1'),
('HD-003', 'Fleece 300 GSM', '0.80', 'Drawcord 1.2m', '1'),
('JK-004', 'Denim 12oz', '1.50', 'YKK Zipper 8 inch', '1');

-- 5. Seeding Costing
INSERT INTO erp_costing ("styleCode", "totalCost") VALUES
('TS-001', '1.15'),
('TP-002', '2.50'),
('HD-003', '4.30');

-- 6. Seeding Sales Orders
INSERT INTO erp_sales ("orderId", "styleCode", buyer, qty, "deliveryDate", status) VALUES
('ORD-1001', 'TS-001', 'FashionCorp', '10000', '2026-10-15', 'Confirmed'),
('ORD-1002', 'HD-003', 'StyleBrands', '5000', '2026-11-01', 'In Production'),
('ORD-1003', 'JK-004', 'GlobalRetail', '15000', '2026-12-10', 'Pending Material');

-- 7. Seeding MRP
INSERT INTO erp_mrp ("planId", status) VALUES
('MRP-26-01', 'Approved'),
('MRP-26-02', 'Draft'),
('MRP-26-03', 'Pending Approval');

-- 8. Seeding Cutting Job
INSERT INTO erp_cutting ("jobId", "orderId", "cutQty") VALUES
('CUT-1001', 'ORD-1001', '5000'),
('CUT-1002', 'ORD-1002', '2500'),
('CUT-1003', 'ORD-1003', '10000');

-- 9. Seeding Bundle Generation
INSERT INTO erp_bundle ("bundleId", size, pcs) VALUES
('BND-001-M', 'M', '50'),
('BND-001-L', 'L', '50'),
('BND-002-S', 'S', '30');

-- 10. Seeding Stitching Output
INSERT INTO erp_stitching ("lineNo", "orderId", "outputQty") VALUES
('Line 1', 'ORD-1001', '1200'),
('Line 2', 'ORD-1002', '850'),
('Line 4', 'ORD-1003', '2100');

-- 11. Seeding Quality Inspection
INSERT INTO erp_quality ("inspectionId", "orderId", "passQty", "failQty") VALUES
('QC-1001', 'ORD-1001', '1150', '50'),
('QC-1002', 'ORD-1002', '840', '10'),
('QC-1003', 'ORD-1003', '2000', '100');

-- 12. Seeding Packing
INSERT INTO erp_packing ("cartonNo", contents) VALUES
('CRT-1001-001', 'TS-001 (M) x 50'),
('CRT-1001-002', 'TS-001 (L) x 50'),
('CRT-1002-001', 'HD-003 (S) x 20');

-- 13. Seeding Dispatch Logistics
INSERT INTO erp_dispatch ("invoiceNo", destination) VALUES
('INV-26-001', 'New York Hub'),
('INV-26-002', 'London DC'),
('INV-26-003', 'Tokyo Retail');

-- 14. Seeding Finished Goods
INSERT INTO erp_finished (style, "totalStock") VALUES
('TS-001', '15000'),
('TP-002', '8000'),
('JK-004', '4500');

-- 15. Seeding External Jobwork
INSERT INTO erp_jobwork ("challanNo", contractor) VALUES
('CH-26-001', 'ABC Dyeing'),
('CH-26-002', 'XYZ Embroidery'),
('CH-26-003', 'Super Wash');

-- 16. Seeding Production Planning
INSERT INTO erp_planning ("planId", "startDate") VALUES
('PLN-1001', '2026-09-20'),
('PLN-1002', '2026-10-05'),
('PLN-1003', '2026-10-15');

-- 17. Seeding Purchase Orders
INSERT INTO erp_purchase ("poNumber", vendor, amount) VALUES
('PO-26-001', 'TexMill Fabrics', '25000'),
('PO-26-002', 'YKK Fasteners', '1000'),
('PO-26-003', 'Global Trims', '4500');

-- 18. Seeding Finishing Status
INSERT INTO erp_finishing ("batchId", status) VALUES
('FIN-1001', 'Washing'),
('FIN-1002', 'Ironing'),
('FIN-1003', 'Folded');

-- 19. Seeding Size/Color Matrix
INSERT INTO erp_matrix ("styleCode", color, size) VALUES
('TS-001', 'Navy Blue', 'M'),
('TS-001', 'Navy Blue', 'L'),
('HD-003', 'Heather Grey', 'XL');

-- ======================================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
-- Allow all operations for authenticated users
-- ======================================================================================

-- Master
ALTER TABLE erp_master ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to master" ON erp_master FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_master FOR SELECT TO anon USING (true); -- Optional: remove if purely private

-- Fabric
ALTER TABLE erp_fabric ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to fabric" ON erp_fabric FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_fabric FOR SELECT TO anon USING (true);

-- Accessories
ALTER TABLE erp_accessories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to accessories" ON erp_accessories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_accessories FOR SELECT TO anon USING (true);

-- BOM
ALTER TABLE erp_bom ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to bom" ON erp_bom FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_bom FOR SELECT TO anon USING (true);

-- Costing
ALTER TABLE erp_costing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to costing" ON erp_costing FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_costing FOR SELECT TO anon USING (true);

-- Sales
ALTER TABLE erp_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to sales" ON erp_sales FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_sales FOR SELECT TO anon USING (true);

-- MRP
ALTER TABLE erp_mrp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to mrp" ON erp_mrp FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_mrp FOR SELECT TO anon USING (true);

-- Cutting
ALTER TABLE erp_cutting ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to cutting" ON erp_cutting FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_cutting FOR SELECT TO anon USING (true);

-- Bundle
ALTER TABLE erp_bundle ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to bundle" ON erp_bundle FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_bundle FOR SELECT TO anon USING (true);

-- Stitching
ALTER TABLE erp_stitching ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to stitching" ON erp_stitching FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_stitching FOR SELECT TO anon USING (true);

-- Quality
ALTER TABLE erp_quality ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to quality" ON erp_quality FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_quality FOR SELECT TO anon USING (true);

-- Packing
ALTER TABLE erp_packing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to packing" ON erp_packing FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_packing FOR SELECT TO anon USING (true);

-- Dispatch
ALTER TABLE erp_dispatch ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to dispatch" ON erp_dispatch FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_dispatch FOR SELECT TO anon USING (true);

-- Finished
ALTER TABLE erp_finished ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to finished" ON erp_finished FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_finished FOR SELECT TO anon USING (true);

-- Jobwork
ALTER TABLE erp_jobwork ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to jobwork" ON erp_jobwork FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_jobwork FOR SELECT TO anon USING (true);

-- Planning
ALTER TABLE erp_planning ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to planning" ON erp_planning FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_planning FOR SELECT TO anon USING (true);

-- Purchase
ALTER TABLE erp_purchase ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to purchase" ON erp_purchase FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_purchase FOR SELECT TO anon USING (true);

-- Finishing
ALTER TABLE erp_finishing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to finishing" ON erp_finishing FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_finishing FOR SELECT TO anon USING (true);

-- Matrix
ALTER TABLE erp_matrix ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access to matrix" ON erp_matrix FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON erp_matrix FOR SELECT TO anon USING (true);
