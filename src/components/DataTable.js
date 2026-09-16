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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: '400', margin: 0 }}>{title}</h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0px', top: '10px', fontSize: '20px', color: 'var(--text-secondary)' }}>search</span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-lux"
              style={{ paddingLeft: '32px', paddingBottom: '8px', paddingTop: '8px', width: '250px' }}
            />
          </div>
          
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
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
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px 8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', transition: 'color 0.3s ease' }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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
            <div key={field.key} style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select 
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={handleInputChange}
                  required={field.required !== false}
                  className="input-lux"
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
                />
              )}
            </div>
          ))}
          
          <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
