"use client";

export default function PlanningModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)' }}>calendar_month</span>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Production Planning</h1>
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
                <th>Prod. Order</th><th>Line</th><th>Target Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              <tr key="0">
                <td>PRD-001</td><td>Line 1</td><td>2000</td>
                <td>
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                </td>
              </tr>
              
              <tr key="1">
                <td>PRD-002</td><td>Line 3</td><td>1500</td>
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
