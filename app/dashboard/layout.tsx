"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/signin");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/invoices", label: "Invoices" },
    { href: "/dashboard/clients", label: "Clients" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - always visible */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Fatura Logo" width={36} height={36} className="rounded" />
            <span className="text-xl font-bold text-blue-600">Fatura.one</span>
          </Link>

          {/* Navigation links */}
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium ${
                  pathname === link.href
                    ? "text-blue-600 border-b-2 border-blue-600 pb-0.5"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}