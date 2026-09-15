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
      backgroundColor: '#0A0A0A',
      color: '#F8F8F8',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRight: '1px solid #D4AF37',
      overflowY: 'auto',
      overflowX: 'hidden',
      transition: 'width 0.4s ease'
    }}>
      <div style={{
        padding: isCollapsed ? '24px 0' : '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '12px',
        borderBottom: '1px solid #D4AF37'
      }}>
        <span className="material-symbols-outlined" style={{ color: '#D4AF37', fontSize: '32px' }}>straighten</span>
        {!isCollapsed && (
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, letterSpacing: '1px' }}>Garment ERP</h2>
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
              padding: isCollapsed ? '12px 0' : '12px 24px',
              backgroundColor: isActive ? '#D4AF37' : 'transparent',
              color: isActive ? '#0A0A0A' : '#A0A0A0',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              borderLeft: isActive && !isCollapsed ? '4px solid #F8F8F8' : '4px solid transparent'
            }}
            onMouseOver={(e) => { 
              if(!isActive) e.currentTarget.style.color = '#F8F8F8'; 
            }}
            onMouseOut={(e) => { 
              if(!isActive) e.currentTarget.style.color = '#A0A0A0'; 
            }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{item.icon}</span>
              {!isCollapsed && (
                <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
