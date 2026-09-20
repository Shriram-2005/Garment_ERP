"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client with the SERVICE ROLE KEY (Bypasses RLS)
const getAdminSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

export async function getCompanyNameByEmail(email) {
  if (email.toLowerCase() === 'garmenterp@gmail.com') {
    return { success: true, companyName: "Global Admin Company" };
  }

  const supabaseAdmin = getAdminSupabase();
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('company_name')
      .eq('email', email.toLowerCase())
      .single();
      
    if (error || !data) {
      console.error("Error fetching company name:", error);
      return { success: false };
    }
    return { success: true, companyName: data.company_name };
  } catch (err) {
    console.error("Exception fetching company name:", err);
    return { success: false };
  }
}

export async function createEmployeeAccount(email, password, companyName, companyId, allowedModules) {
  const supabaseAdmin = getAdminSupabase();

  try {
    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        company_name: companyName,
        company_id: companyId,
        role: allowedModules.join(",") // Store array of modules as a comma-separated string
      }
    });

    if (authError) {
      console.error("Auth Error:", authError);
      return { success: false, error: authError.message };
    }

    // 2. The database trigger 'on_auth_user_created' will automatically insert into user_profiles
    // We just return success!
    return { success: true, user: authData.user };

  } catch (err) {
    console.error("Failed to create employee:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteEmployeeAccount(userId) {
  const supabaseAdmin = getAdminSupabase();
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to delete user." };
  }
}

export async function suspendEmployeeAccount(userId) {
  // Suspending a user in Supabase means updating their 'banned_until' or deleting them,
  // Or we can just set their role to 'SUSPENDED' in user_profiles.
  const supabaseAdmin = getAdminSupabase();
  try {
    const { error } = await supabaseAdmin.from('user_profiles').update({ role: 'SUSPENDED' }).eq('id', userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to suspend user." };
  }
}

export async function updateEmployeePermissions(userId, allowedModules) {
  const supabaseAdmin = getAdminSupabase();
  try {
    const roleString = allowedModules.join(",");
    const { error } = await supabaseAdmin.from('user_profiles').update({ role: roleString }).eq('id', userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to update permissions." };
  }
}

export async function createCompanyAndAdmin(companyName, adminEmail, adminPassword) {
  const supabaseAdmin = getAdminSupabase();
  try {
    // 1. Insert into erp_companies
    const { data: company, error: companyError } = await supabaseAdmin
      .from('erp_companies')
      .insert([{ name: companyName }])
      .select()
      .single();

    if (companyError) return { success: false, error: companyError.message };

    // 2. Create the admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        company_name: companyName,
        company_id: company.id,
        role: 'ADMIN' // They are the admin for this specific company
      }
    });

    if (authError) {
      // Rollback company creation
      await supabaseAdmin.from('erp_companies').delete().eq('id', company.id);
      return { success: false, error: authError.message };
    }

    return { success: true, company, user: authData.user };
  } catch (err) {
    return { success: false, error: "Failed to create company." };
  }
}
