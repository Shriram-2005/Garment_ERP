import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useProfile } from "@/components/ProfileProvider";

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const pathname = usePathname();
  const { hasAccess, profile } = useProfile();
  const [openCategories, setOpenCategories] = useState({});

  const isSuperAdmin = profile?.role?.toUpperCase().includes('SUPER_ADMIN');
  const isAdmin = profile?.role?.toLowerCase().includes('admin');

  // Filter categories and items based on permissions
  const filteredCategories = [];

  if (isSuperAdmin) {
    filteredCategories.push({
      title: "Global Administration",
      icon: "public",
      items: [
        { name: "Manage Companies", path: "/settings/companies", icon: "domain" }
      ]
    });
  } else {
    const categories = [
      {
        title: "Dashboard",
        icon: "dashboard",
        items: [
          { name: "Overview", path: "/dashboard", icon: "monitoring" },
          { name: "Analytics", path: "/dashboard/charts", icon: "analytics" },
          { name: "Tracking", path: "/dashboard/tracking", icon: "linear_scale" },
          { name: "Data Importing", path: "/dashboard/import", icon: "upload_file" }
        ]
      },
      {
        title: "Product Engineering",
        icon: "architecture",
        items: [
          { name: "Product Master", path: "/master", icon: "checkroom" },
          { name: "Size & Colour", path: "/matrix", icon: "grid_on" },
          { name: "Bill of Materials", path: "/bom", icon: "receipt_long" },
          { name: "Costing", path: "/costing", icon: "payments" }
        ]
      },
      {
        title: "Inventory & Sourcing",
        icon: "inventory_2",
        items: [
          { name: "Fabric Stock", path: "/fabric", icon: "layers" },
          { name: "Trims Stock", path: "/accessories", icon: "category" },
          { name: "Purchase", path: "/purchase", icon: "shopping_cart" }
        ]
      },
      {
        title: "Sales & Planning",
        icon: "trending_up",
        items: [
          { name: "Sales Order", path: "/sales", icon: "storefront" },
          { name: "MRP", path: "/mrp", icon: "precision_manufacturing" },
          { name: "Planning", path: "/planning", icon: "calendar_month" }
        ]
      },
      {
        title: "Production Floor",
        icon: "factory",
        items: [
          { name: "Cutting", path: "/cutting", icon: "content_cut" },
          { name: "Bundle Mgmt", path: "/bundle", icon: "qr_code_2" },
          { name: "Sewing", path: "/stitching", icon: "format_line_spacing" },
          { name: "Job Work", path: "/jobwork", icon: "engineering" },
          { name: "Finishing", path: "/finishing", icon: "dry_cleaning" }
        ]
      },
      {
        title: "Logistics & QA",
        icon: "local_shipping",
        items: [
          { name: "Quality", path: "/quality", icon: "fact_check" },
          { name: "Packing", path: "/packing", icon: "inventory" },
          { name: "Finished Goods", path: "/finished", icon: "warehouse" },
          { name: "Dispatch", path: "/dispatch", icon: "flight_takeoff" }
        ]
      },
      {
        title: "Export & Reports",
        icon: "file_download",
        items: [
          { name: "Complete Export", path: "/export/complete", icon: "inventory_2" },
          { name: "Custom Export", path: "/export/custom", icon: "tune" }
        ]
      },
      {
        title: "System Settings",
        icon: "settings",
        adminOnly: true,
        items: [
          { name: "User Management", path: "/settings/users", icon: "manage_accounts" }
        ]
      }
    ];

    categories.forEach(cat => {
      if (cat.adminOnly && !isAdmin) return;

      if (cat.title === "Dashboard" || cat.title === "Export & Reports" || cat.title === "System Settings") {
        filteredCategories.push(cat);
      } else {
        const allowedItems = cat.items.filter(item => {
          const moduleName = item.path.split('/')[1]; // e.g. "sales"
          return hasAccess(moduleName);
        });
        
        if (allowedItems.length > 0) {
          filteredCategories.push({ ...cat, items: allowedItems });
        }
      }
    });
  }

  // Auto-expand category containing the active route
  useEffect(() => {
    if (isCollapsed) return;
    filteredCategories.forEach(cat => {
      if (cat.items.some(item => item.path === pathname)) {
        setOpenCategories(prev => ({ ...prev, [cat.title]: true }));
      }
    });
  }, [pathname, isCollapsed, profile]);

  const handleCategoryClick = (title) => {
    if (isCollapsed && toggleSidebar) {
      // If collapsed, open the sidebar AND open this category
      toggleSidebar();
      setOpenCategories(prev => ({ ...prev, [title]: true }));
    } else {
      // Normal toggle
      setOpenCategories(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    }
  };

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
        borderBottom: '1px solid var(--border-color)',
        minHeight: '80px'
      }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--accent)', fontSize: '32px' }}>straighten</span>
        {!isCollapsed && (
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: '400', margin: 0, letterSpacing: '1px' }}>Garment ERP</h2>
        )}
      </div>

      <nav style={{ flex: 1, padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredCategories.map((category, index) => {
          const isOpen = openCategories[category.title];
          const hasActiveItem = category.items.some(item => item.path === pathname);
          
          return (
            <div key={category.title} style={{ marginBottom: isCollapsed ? '0' : '8px' }}>
              <div 
                onClick={() => handleCategoryClick(category.title)}
                title={isCollapsed ? category.title : ""}
                style={{
                  padding: isCollapsed ? '12px 0' : '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  cursor: 'pointer',
                  color: hasActiveItem ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 0.3s ease',
                  backgroundColor: isCollapsed && hasActiveItem ? 'var(--sidebar-hover)' : 'transparent',
                  borderLeft: isCollapsed && hasActiveItem ? '3px solid var(--accent)' : '3px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--accent)';
                  if (isCollapsed) e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = hasActiveItem ? 'var(--text-primary)' : 'var(--text-secondary)';
                  if (isCollapsed && !hasActiveItem) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px', color: hasActiveItem ? 'var(--accent)' : 'inherit', transition: 'font-size 0.3s ease' }}>{category.icon}</span>
                  {!isCollapsed && (
                    <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>
                      {category.title}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <span className="material-symbols-outlined" style={{ 
                    fontSize: '18px', 
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    expand_more
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <div style={{ 
                  height: isOpen ? 'auto' : '0px', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {category.items.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link href={item.path} key={item.path} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '16px',
                        padding: '10px 24px 10px 54px',
                        backgroundColor: 'transparent',
                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent'
                      }}
                      onMouseOver={(e) => { 
                        if(!isActive) e.currentTarget.style.color = 'var(--text-primary)'; 
                        if(!isActive) e.currentTarget.style.paddingLeft = '58px';
                      }}
                      onMouseOut={(e) => { 
                        if(!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; 
                        if(!isActive) e.currentTarget.style.paddingLeft = '54px';
                      }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: '400', letterSpacing: '0.5px' }}>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
