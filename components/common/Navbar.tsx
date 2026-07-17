"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/invoice/new", label: "New Invoice" },
    { href: "/clients", label: "Clients" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            Fatura.one
          </Link>

          {/* Desktop Links + Language */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-4">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-slate-700">
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium ${
                  pathname === link.href ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}