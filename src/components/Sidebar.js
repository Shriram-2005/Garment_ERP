import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isCollapsed }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Product Master", path: "/master", icon: "checkroom" },
    { name: "Size & Colour", path: "/matrix", icon: "grid_on" },
    { name: "Fabric Stock", path: "/fabric", icon: "inventory_2" },
    { name: "Trims Stock", path: "/accessories", icon: "category" },
    { name: "Purchase", path: "/purchase", icon: "shopping_cart" },
    { name: "Bill of Materials", path: "/bom", icon: "receipt_long" },
    { name: "Costing", path: "/costing", icon: "payments" },
    { name: "Sales Order", path: "/sales", icon: "storefront" },
    { name: "MRP", path: "/mrp", icon: "precision_manufacturing" },
    { name: "Planning", path: "/planning", icon: "calendar_month" },
    { name: "Cutting", path: "/cutting", icon: "content_cut" },
    { name: "Bundle Mgmt", path: "/bundle", icon: "qr_code_2" },
    { name: "Sewing", path: "/stitching", icon: "format_line_spacing" },
    { name: "Job Work", path: "/jobwork", icon: "engineering" },
    { name: "Finishing", path: "/finishing", icon: "dry_cleaning" },
    { name: "Quality", path: "/quality", icon: "fact_check" },
    { name: "Packing", path: "/packing", icon: "inventory" },
    { name: "Finished Goods", path: "/finished", icon: "warehouse" },
    { name: "Dispatch", path: "/dispatch", icon: "local_shipping" },
  ];

  return (
    <aside style={{
      width: isCollapsed ? '80px' : '260px',
      backgroundColor: 'var(--sidebar-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRight: '1px solid var(--border-color)',
      overflowY: 'auto',
      overflowX: 'hidden',
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{
        padding: isCollapsed ? '24px 0' : '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '12px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--accent)', fontSize: '32px' }}>straighten</span>
        {!isCollapsed && (
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: '400', margin: 0, letterSpacing: '1px' }}>Garment ERP</h2>
        )}
      </div>

      <nav style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link href={item.path} key={item.path} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '16px',
              padding: isCollapsed ? '12px 0' : '14px 24px',
              backgroundColor: isActive ? 'var(--sidebar-hover)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              borderLeft: isActive && !isCollapsed ? '3px solid var(--accent)' : '3px solid transparent'
            }}
            onMouseOver={(e) => { 
              if(!isActive) e.currentTarget.style.color = 'var(--text-primary)'; 
            }}
            onMouseOut={(e) => { 
              if(!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; 
            }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
              {!isCollapsed && (
                <span style={{ fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
