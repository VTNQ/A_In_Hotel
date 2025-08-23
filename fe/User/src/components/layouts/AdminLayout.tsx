import React, {  useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import AdminTopBar from "../AdminTopBar";
import AdminLeftBar from "../AdminLeftBar";

const AdminLayout=()=>{
  const [mobileOpen, setMobileOpen] = useState(false);

  // lock body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-white text-indigo-900">
      <AdminTopBar onToggleMobile={() => setMobileOpen(true)} />

      <div className="mx-auto  px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[16rem,1fr] gap-6 py-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block sticky top-20 self-start max-h-[calc(100vh-6rem)]">
            <div className="h-[calc(100vh-8rem)]">
              <AdminLeftBar />
            </div>
          </div>

          {/* Main content */}
          <main className="min-h-[60vh]">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%]">
            <div className="h-full animate-[slideIn_.2s_ease-out]">
              <div className="h-full bg-white border-r shadow-xl">
                <div className="h-16 flex items-center justify-between px-4 border-b">
                  <span className="font-semibold">Menu</span>
                  <button
                    className="rounded-xl p-2 hover:bg-indigo-50"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close sidebar"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 6l12 12M6 18L18 6" />
                    </svg>
                  </button>
                </div>
                <AdminLeftBar />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default AdminLayout;