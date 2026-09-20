-- 1. Create erp_companies table
CREATE TABLE IF NOT EXISTS erp_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Insert Default Company A
INSERT INTO erp_companies (name)
SELECT 'Company A'
WHERE NOT EXISTS (SELECT 1 FROM erp_companies WHERE name = 'Company A');

-- 3. Add company_id to user_profiles BEFORE creating functions that reference it
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES erp_companies(id);

-- 4. Security Definer Functions
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT role ILIKE '%SUPER_ADMIN%' FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 4. Apply Schema Changes and Data Migration
DO $$
DECLARE
    default_company_id UUID;
    t_name TEXT;
    tables TEXT[] := ARRAY[
      'erp_master', 'erp_matrix', 'erp_bom', 'erp_costing',
      'erp_fabric', 'erp_accessories', 'erp_purchase',
      'erp_sales', 'erp_mrp', 'erp_planning',
      'erp_cutting', 'erp_bundle', 'erp_stitching', 'erp_jobwork', 'erp_finishing',
      'erp_quality', 'erp_packing', 'erp_finished', 'erp_dispatch'
    ];
BEGIN
    SELECT id INTO default_company_id FROM erp_companies WHERE name = 'Company A' LIMIT 1;

    -- Update existing users to Company A
    UPDATE user_profiles SET company_id = default_company_id WHERE company_id IS NULL;

    -- Update garmenterp@gmail.com to Super Admin and clear company_id
    UPDATE user_profiles SET role = 'SUPER_ADMIN', company_id = NULL WHERE email = 'garmenterp@gmail.com';

    -- Loop through all erp tables to add company_id
    FOREACH t_name IN ARRAY tables
    LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=t_name AND column_name='company_id') THEN
            EXECUTE format('ALTER TABLE %I ADD COLUMN company_id UUID REFERENCES erp_companies(id) DEFAULT get_user_company_id();', t_name);
        END IF;

        -- Update existing data
        EXECUTE format('UPDATE %I SET company_id = %L WHERE company_id IS NULL;', t_name, default_company_id);
    END LOOP;
END $$;

-- 5. Update Postgres Trigger to copy company_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, company_name, role, company_id)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'role',
    (new.raw_user_meta_data->>'company_id')::uuid
  );
  RETURN new;
END;
$$;

-- 6. Apply Row Level Security (RLS)
ALTER TABLE erp_companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super Admins can manage companies" ON erp_companies;
CREATE POLICY "Super Admins can manage companies" ON erp_companies
FOR ALL USING (is_super_admin());

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin can do all on users" ON user_profiles;
CREATE POLICY "Super admin can do all on users" ON user_profiles
FOR ALL USING (is_super_admin());

DROP POLICY IF EXISTS "Admins can view and manage their own company users" ON user_profiles;
CREATE POLICY "Admins can view and manage their own company users" ON user_profiles
FOR ALL USING (company_id = get_user_company_id());

-- Apply RLS to all ERP tables
DO $$
DECLARE
    t_name TEXT;
    tables TEXT[] := ARRAY[
      'erp_master', 'erp_matrix', 'erp_bom', 'erp_costing',
      'erp_fabric', 'erp_accessories', 'erp_purchase',
      'erp_sales', 'erp_mrp', 'erp_planning',
      'erp_cutting', 'erp_bundle', 'erp_stitching', 'erp_jobwork', 'erp_finishing',
      'erp_quality', 'erp_packing', 'erp_finished', 'erp_dispatch'
    ];
BEGIN
    FOREACH t_name IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t_name);
        
        EXECUTE format('DROP POLICY IF EXISTS "Tenant isolation" ON %I;', t_name);
        EXECUTE format('CREATE POLICY "Tenant isolation" ON %I FOR ALL USING (company_id = get_user_company_id()) WITH CHECK (company_id = get_user_company_id());', t_name);
    END LOOP;
END $$;
