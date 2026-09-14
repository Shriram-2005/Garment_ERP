"use client";

export default function CostingModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)' }}>payments</span>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Costing</h1>
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
                <th>Style</th><th>Material Cost</th><th>Total Mfg Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              <tr key="0">
                <td>TS-01</td><td>$2.50</td><td>$3.80</td>
                <td>
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                </td>
              </tr>
              
              <tr key="1">
                <td>TP-02</td><td>$4.00</td><td>$5.50</td>
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
