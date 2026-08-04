interface BadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'active' | 'inactive';
  label?: string;
}

const configs = {
  pending: 'badge-pending',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
  cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 badge',
  active: 'badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500 badge',
};

const dots = {
  pending: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
  cancelled: 'bg-gray-400',
  active: 'bg-emerald-500',
  inactive: 'bg-gray-400',
};

const labels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  active: 'Active',
  inactive: 'Inactive',
};

export default function StatusBadge({ status, label }: BadgeProps) {
  return (
    <span className={configs[status]}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {label ?? labels[status]}
    </span>
  );
}
