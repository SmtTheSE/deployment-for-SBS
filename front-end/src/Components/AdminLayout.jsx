import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all local storage items related to authentication
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("accountId");
    localStorage.removeItem("isGuest");
    
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSideBar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;