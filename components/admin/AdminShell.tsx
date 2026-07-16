"use client";

import { usePathname } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-gold-50">
      {!isLogin ? <AdminNav /> : null}
      <main
        className={
          isLogin ? "min-h-screen" : "max-w-7xl mx-auto px-4 py-8"
        }
      >
        {children}
      </main>
    </div>
  );
}
