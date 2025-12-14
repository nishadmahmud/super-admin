export default function StatusBadge({ status, size = 'sm' }) {
    const statusConfig = {
        active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        inactive: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
        pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
        expired: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
        high: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
        medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
        low: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
        open: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
        resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        closed: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.inactive;
    const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
