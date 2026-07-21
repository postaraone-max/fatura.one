'use client';

import { useI18n } from '@/lib/i18n/provider';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartProps {
  monthlyData: {
    month: string;
    revenue: number;
    invoices: number;
  }[];
}

export default function DashboardChart({ monthlyData }: ChartProps) {
  const { t } = useI18n();

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} IQD`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((item: any) => (
            <p key={item.name} className="text-sm" style={{ color: item.color }}>
              {item.name}: {item.name === 'Revenue' ? formatCurrency(item.value) : item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.chart.title')}
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              fill="#3b82f6"
              fillOpacity={0.1}
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Bar
              yAxisId="right"
              dataKey="invoices"
              name="Invoices"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}