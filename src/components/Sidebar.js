import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/", icon: "dashboard" },
    { name: "Product Master", path: "/master", icon: "checkroom" },
    { name: "Size & Colour Matrix", path: "/matrix", icon: "grid_on" },
    { name: "Fabric Inventory", path: "/fabric", icon: "inventory_2" },
    { name: "Accessories Inventory", path: "/accessories", icon: "category" },
    { name: "Purchase Management", path: "/purchase", icon: "shopping_cart" },
    { name: "Bill of Materials", path: "/bom", icon: "receipt_long" },
    { name: "Costing", path: "/costing", icon: "payments" },
    { name: "Sales Order", path: "/sales", icon: "storefront" },
    { name: "MRP", path: "/mrp", icon: "precision_manufacturing" },
    { name: "Production Planning", path: "/planning", icon: "calendar_month" },
    { name: "Cutting Management", path: "/cutting", icon: "content_cut" },
    { name: "Bundle Management", path: "/bundle", icon: "qr_code_2" },
    { name: "Stitching / Sewing", path: "/stitching", icon: "format_line_spacing" },
    { name: "Job Work", path: "/jobwork", icon: "engineering" },
    { name: "Finishing", path: "/finishing", icon: "dry_cleaning" },
    { name: "Quality Control", path: "/quality", icon: "fact_check" },
    { name: "Packing", path: "/packing", icon: "inventory" },
    { name: "Finished Goods", path: "/finished", icon: "warehouse" },
    { name: "Dispatch", path: "/dispatch", icon: "local_shipping" },
  ];

  return (
    <aside style={{
      width: '280px',
      backgroundColor: 'var(--sidebar-bg)',
      color: 'var(--sidebar-text)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRight: '1px solid var(--border-color)',
      overflowY: 'auto'
    }}>
      <div style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--accent)', fontSize: '32px' }}>factory</span>
        <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, letterSpacing: '0.5px' }}>Garment ERP</h2>
      </div>

      <nav style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link href={item.path} key={item.path} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              backgroundColor: isActive ? 'var(--sidebar-hover)' : 'transparent',
              color: isActive ? '#fff' : 'var(--sidebar-text)',
              transition: 'background-color 0.2s ease',
              textDecoration: 'none'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400' }}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
