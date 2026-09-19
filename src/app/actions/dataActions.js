"use server";

import { createClient } from "@/utils/supabase/server";

export async function initServerStore() {
  // Initialization is no longer required with Supabase
  return { success: true };
}

export async function fetchRecords(moduleName) {
  const supabase = await createClient();
  const tableName = `erp_${moduleName}`;
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Supabase fetchRecords Error:", error);
    return [];
  }
  return data;
}

export async function fetchAllData() {
  const supabase = await createClient();
  
  const [masterRes, salesRes, fabricRes, qualityRes, costingRes, stitchingRes] = await Promise.all([
    supabase.from('erp_master').select('*'),
    supabase.from('erp_sales').select('*'),
    supabase.from('erp_fabric').select('*'),
    supabase.from('erp_quality').select('*'),
    supabase.from('erp_costing').select('*'),
    supabase.from('erp_stitching').select('*')
  ]);
  
  return {
    master: masterRes.data || [],
    sales: salesRes.data || [],
    fabric: fabricRes.data || [],
    quality: qualityRes.data || [],
    costing: costingRes.data || [],
    stitching: stitchingRes.data || []
  };
}

export async function createRecord(moduleName, record) {
  const supabase = await createClient();
  const tableName = `erp_${moduleName}`;
  const { data, error } = await supabase
    .from(tableName)
    .insert([record])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function createRecordsBatch(moduleName, records) {
  const supabase = await createClient();
  const tableName = `erp_${moduleName}`;
  const { data, error } = await supabase
    .from(tableName)
    .insert(records)
    .select();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, count: data?.length || 0 };
}

export async function modifyRecord(moduleName, id, record) {
  const supabase = await createClient();
  const tableName = `erp_${moduleName}`;
  const { data, error } = await supabase
    .from(tableName)
    .update(record)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function removeRecord(moduleName, id) {
  const supabase = await createClient();
  const tableName = `erp_${moduleName}`;
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function updateRecordStatus(moduleName, id, newStatus) {
  const supabase = await createClient();
  const tableName = `erp_${moduleName}`;
  const { data, error } = await supabase
    .from(tableName)
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}
