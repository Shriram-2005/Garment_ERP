"use client";

export default function BundleModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)' }}>qr_code_2</span>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Bundle Management</h1>
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
                <th>Bundle ID</th><th>Size</th><th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              <tr key="0">
                <td>B-101</td><td>M</td><td>50</td>
                <td>
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                </td>
              </tr>
              
              <tr key="1">
                <td>B-102</td><td>L</td><td>50</td>
                <td>
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
