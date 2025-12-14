export default function StatsCard({
    title,
    value,
    icon,
    trend,
    trendValue,
    color = 'purple'
}) {
    const colorClasses = {
        purple: 'bg-purple-50 text-[#673DE6]',
        green: 'bg-emerald-50 text-emerald-600',
        yellow: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600',
        blue: 'bg-blue-50 text-blue-600',
    };

    return (
        <div className="card card-hover p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>

                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            {trend === 'up' ? (
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {trendValue}
                            </span>
                            <span className="text-sm text-gray-400">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
