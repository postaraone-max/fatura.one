'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
  { name: 'Clients', href: '/clients', icon: UserGroupIcon },
  { name: 'Pricing', href: '/pricing', icon: CreditCardIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">Fatura.one</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}