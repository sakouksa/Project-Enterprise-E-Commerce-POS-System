import React from 'react';
import { FeatureStatus } from '../../types/docs';
import { CheckCircle2, AlertTriangle, XCircle, Clock, FlaskConical } from 'lucide-react';
import { useDocs } from '../../stores/useDocsStore';

interface StatusBadgeProps {
  status: FeatureStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showLabel = true }) => {
  const { language } = useDocs();

  const config = {
    implemented: {
      labelKh: 'សម្រេចរួចរាល់',
      labelEn: 'Implemented',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    partial: {
      labelKh: 'សម្រេចបានខ្លះ',
      labelEn: 'Partial',
      bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
      icon: AlertTriangle,
      dot: 'bg-amber-500',
    },
    planned: {
      labelKh: 'គម្រោងអនាគត',
      labelEn: 'Planned Feature',
      bg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
      icon: Clock,
      dot: 'bg-blue-500',
    },
    broken: {
      labelKh: 'កំពុងកែសម្រួល',
      labelEn: 'Needs Fix',
      bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30',
      icon: XCircle,
      dot: 'bg-rose-500',
    },
    experimental: {
      labelKh: 'មុខងារសាកល្បង',
      labelEn: 'Experimental',
      bg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
      icon: FlaskConical,
      dot: 'bg-purple-500',
    }
  };

  const item = config[status] || config.implemented;
  const Icon = item.icon;
  const label = language === 'km' ? item.labelKh : item.labelEn;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span className={`inline-flex items-center rounded-full border shadow-2xs ${item.bg} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5" />
      {showLabel && <span>{label}</span>}
    </span>
  );
};
