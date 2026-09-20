-- Strict RLS Cleanup for user_profiles
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    -- Drop all existing policies on user_profiles to ensure no leaks from older setups
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles;', pol.policyname);
    END LOOP;
END $$;

-- 1. Super Admins can see and do everything
CREATE POLICY "Super admin can do all on users" ON user_profiles
FOR ALL USING (is_super_admin());

-- 2. Admins can ONLY see users within their EXACT company (Strict Tenant Isolation)
CREATE POLICY "Admins can view and manage their own company users" ON user_profiles
FOR ALL USING (
  NOT is_super_admin() AND
  company_id IS NOT NULL AND 
  company_id = get_user_company_id()
);

-- 3. Users can always view their own profile (Required for login to work)
CREATE POLICY "Users can view their own profile" ON user_profiles
FOR SELECT USING (id = auth.uid());
