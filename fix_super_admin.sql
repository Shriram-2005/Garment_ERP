INSERT INTO public.user_profiles (id, email, role, company_name)
SELECT id, email, 'SUPER_ADMIN', 'Global Admin Company'
FROM auth.users
WHERE email = 'garmenterp@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'SUPER_ADMIN', company_name = 'Global Admin Company';
