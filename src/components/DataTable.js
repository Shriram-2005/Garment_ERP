"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { fetchRecords, createRecord, removeRecord, updateRecordStatus, modifyRecord } from "@/app/actions/dataActions";
import { useToast } from "@/components/ToastProvider";

export default function DataTable({ moduleName, schema, title = "Module Data", onDataChange, customActions }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { addToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRecords(moduleName);
      setRecords(data || []);
      if (onDataChange) onDataChange(data);
    } catch (error) {
      addToast("Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setCurrentPage(1); // Reset to first page when module changes
  }, [moduleName]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenEdit = (record) => {
    setEditingId(record.id);
    setFormData(record);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editingId) {
      const { id, created_at, ...updateData } = formData;
      result = await modifyRecord(moduleName, editingId, updateData);
    } else {
      result = await createRecord(moduleName, formData);
    }
    
    if (result.success) {
      addToast(`Record ${editingId ? 'updated' : 'added'} successfully.`, "success");
      handleCloseModal();
      loadData();
    } else {
      addToast(result.error || `Failed to ${editingId ? 'update' : 'add'} record.`, "error");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      const result = await removeRecord(moduleName, id);
      if (result.success) {
        addToast("Record deleted successfully.", "success");
        loadData();
      } else {
        addToast(result.error || "Failed to delete record.", "error");
      }
    }
  };

  const handleCustomAction = async (id, newStatus, msg) => {
    const result = await updateRecordStatus(moduleName, id, newStatus);
    if (result.success) {
      addToast(msg || `Status updated to ${newStatus}.`, "success");
      loadData();
    } else {
      addToast(result.error || "Failed to update status.", "error");
    }
  };

  const filteredRecords = records.filter(record => {
    if (!search) return true;
    return schema.some(field => 
      record[field.key] && record[field.key].toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="card">
      {/* Invisible overlay to close dropdowns when clicking outside */}
      {openMenuId !== null && (
        <div 
          onClick={() => setOpenMenuId(null)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
        />
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: '400', margin: 0 }}>{title}</h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0px', top: '10px', fontSize: '20px', color: 'var(--text-secondary)' }}>search</span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="input-lux"
              style={{ paddingLeft: '32px', paddingBottom: '8px', paddingTop: '8px', width: '250px' }}
            />
          </div>
          
          <button className="btn btn-primary" onClick={() => { setEditingId(null); setFormData({}); setIsModalOpen(true); }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Add Record
          </button>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading data...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No records found.
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  {schema.map(field => (
                    <th key={field.key}>{field.label}</th>
                  ))}
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record, index) => {
                  // If it's one of the last two rows and there are more than 2 rows, open menu upwards
                  const isBottomRow = index >= paginatedRecords.length - 2 && paginatedRecords.length > 2;
                  
                  return (
                    <tr key={record.id}>
                      {schema.map(field => (
                        <td key={field.key}>
                          {field.key === 'status' ? (
                            <span style={{
                              padding: '4px 8px',
                              border: '1px solid',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-primary)',
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }}>
                              {record[field.key] || "Pending"}
                            </span>
                          ) : (
                            record[field.key]
                          )}
                        </td>
                      ))}
                      <td style={{ textAlign: 'right', position: 'relative' }}>
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === record.id ? null : record.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        
                        {openMenuId === record.id && (
                          <div style={{ 
                            position: 'absolute', 
                            right: '30px', 
                            top: isBottomRow ? 'auto' : '50%', 
                            bottom: isBottomRow ? '50%' : 'auto',
                            background: 'var(--sidebar-bg)', 
                            backdropFilter: 'blur(12px)',
                            border: '1px solid var(--border-highlight)', 
                            borderRadius: '12px',
                            overflow: 'hidden',
                            zIndex: 50, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            minWidth: '180px', 
                            boxShadow: 'var(--card-shadow)',
                            transform: isBottomRow ? 'translateY(10px)' : 'translateY(-10px)'
                          }}>
                            {customActions && customActions(record).map((action, i) => (
                              <button 
                                key={i} 
                                onClick={async () => {
                                  setOpenMenuId(null);
                                  if (action.onClick) {
                                    action.onClick(record);
                                  } else {
                                    await handleCustomAction(record.id, action.status, action.successMsg);
                                  }
                                }}
                                style={{ padding: '12px 20px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '24px'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.paddingLeft = '20px'; }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{action.icon || 'play_circle'}</span>
                                {action.label}
                              </button>
                            ))}
                            <button 
                              onClick={() => handleOpenEdit(record)}
                              style={{ padding: '12px 20px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}
                              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '24px'; }}
                              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.paddingLeft = '20px'; }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit_square</span>
                              Edit Record
                            </button>
                            <button 
                              onClick={() => { setOpenMenuId(null); handleDelete(record.id); }}
                              style={{ padding: '12px 20px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--error)', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}
                              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--border-color)'; e.currentTarget.style.paddingLeft = '24px'; }}
                              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.paddingLeft = '20px'; }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_outline</span>
                              Delete Record
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)', padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '12px' }}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--text-primary)', padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '12px' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`${editingId ? 'Edit' : 'Add'} ${title}`}>
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
            <button type="button" className="btn" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save Changes' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
