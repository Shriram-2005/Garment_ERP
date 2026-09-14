"use client";
import { useState, useEffect } from "react";
import Login from "./login";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function ClientLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem("auth");
    if (auth === "true") setIsAuthenticated(true);
    
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const login = (email, password) => {
    if (email === "demo@demo.com" && password === "demo123") {
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
    } else {
      alert("Invalid credentials. Please use demo@demo.com / demo123");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar toggleTheme={toggleTheme} theme={theme} logout={logout} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
