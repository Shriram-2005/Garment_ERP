"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { getRecords, addRecord, deleteRecord } from "@/utils/dataStore";

export default function DataTable({ moduleName, schema, title = "Module Data", onDataChange }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const loadData = () => {
    const data = getRecords(moduleName);
    setRecords(data);
    if (onDataChange) onDataChange(data);
  };

  useEffect(() => {
    loadData();
  }, [moduleName]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecord(moduleName, formData);
    setIsModalOpen(false);
    setFormData({});
    loadData();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteRecord(moduleName, id);
      loadData();
    }
  };

  const filteredRecords = records.filter(record => {
    if (!search) return true;
    return schema.some(field => 
      record[field.key] && record[field.key].toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '600', margin: 0 }}>{title}</h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '20px', color: 'var(--text-secondary)' }}>search</span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-lux"
              style={{ paddingLeft: '40px', paddingBottom: '8px', paddingTop: '8px', width: '250px' }}
            />
          </div>
          
          <button onClick={() => setIsModalOpen(true)} style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0A0A0A', 
            color: '#F8F8F8', 
            border: '1px solid #0A0A0A', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#0A0A0A'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.borderColor = '#0A0A0A'; e.currentTarget.style.color = '#F8F8F8'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            Add Record
          </button>
        </div>
      </div>

      <div className="table-container">
        {filteredRecords.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No records found.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {schema.map(field => (
                  <th key={field.key}>{field.label}</th>
                ))}
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  {schema.map(field => (
                    <td key={field.key}>{record[field.key]}</td>
                  ))}
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(record.id)}
                      style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Record">
        <form onSubmit={handleSubmit}>
          {schema.map(field => (
            <div key={field.key} style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select 
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={handleInputChange}
                  required={field.required !== false}
                  className="input-lux"
                  style={{ width: '100%', padding: '12px 0' }}
                >
                  <option value="" disabled>Select {field.label}</option>
                  {field.options && field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type={field.type || "text"}
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field.label}`}
                  required={field.required !== false}
                  className="input-lux"
                  style={{ width: '100%', padding: '12px 0' }}
                />
              )}
            </div>
          ))}
          
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ 
              padding: '12px 24px', 
              backgroundColor: 'transparent', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              fontSize: '11px',
              cursor: 'pointer',
            }}>
              Cancel
            </button>
            <button type="submit" style={{ 
              padding: '12px 24px', 
              backgroundColor: '#0A0A0A', 
              color: '#F8F8F8', 
              border: '1px solid #0A0A0A', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              fontSize: '11px',
              cursor: 'pointer',
            }}>
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
