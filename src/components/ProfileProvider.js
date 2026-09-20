"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const ProfileContext = createContext();

export function ProfileProvider({ children, user }) {
  const [profile, setProfile] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    if (user?.email) {
      const fetchProfile = async () => {
        const { data } = await supabase.from('user_profiles').select('*').eq('email', user.email).single();
        if (data) setProfile(data);
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  // Helper function to check module access
  const hasAccess = (moduleKey) => {
    if (!profile || !profile.role) return false;
    const roleStr = profile.role.toLowerCase();
    if (roleStr.includes('admin')) return true;
    if (roleStr === 'suspended') return false;
    return roleStr.includes(moduleKey.toLowerCase());
  };

  return (
    <ProfileContext.Provider value={{ profile, hasAccess }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
