import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

export default function KPICard({ title, value, icon: Icon, trend, color }: KPICardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    amber: 'from-amber-500 to-orange-500',
    purple: 'from-violet-500 to-purple-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 font-medium">↑ {trend}</p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
            colorClasses[color as keyof typeof colorClasses]
          } flex items-center justify-center shadow-md`}
        >
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}
