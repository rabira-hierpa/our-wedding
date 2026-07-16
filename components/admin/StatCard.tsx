import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
}

export default function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white border border-champagne-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-champagne-500 font-medium">
            {label}
          </p>
          <p className="mt-2 font-serif text-3xl text-champagne-900">{value}</p>
          {subtitle ? (
            <p className="mt-1 text-sm text-champagne-600">{subtitle}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="p-2 rounded-lg bg-gold-50 text-gold-700">
            <Icon className="w-5 h-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
