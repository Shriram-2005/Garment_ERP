"use client";

export default function PackingModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)' }}>inventory</span>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Packing Management</h1>
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
                <th>Carton No</th><th>Style</th><th>Pcs/Carton</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              <tr key="0">
                <td>C-001</td><td>TS-01</td><td>100</td>
                <td>
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                </td>
              </tr>
              
              <tr key="1">
                <td>C-002</td><td>TP-02</td><td>50</td>
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
