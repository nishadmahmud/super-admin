import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';

// Dummy data for demonstration
const topShops = [
    { id: 1, name: 'TechMart Electronics', revenue: '$12,450', status: 'active', growth: '+15%' },
    { id: 2, name: 'Fashion Hub', revenue: '$9,820', status: 'active', growth: '+8%' },
    { id: 3, name: 'Green Grocers', revenue: '$8,540', status: 'active', growth: '+12%' },
    { id: 4, name: 'Book Haven', revenue: '$7,230', status: 'pending', growth: '+5%' },
    { id: 5, name: 'Sports Zone', revenue: '$6,890', status: 'active', growth: '+10%' },
];

const shopColumns = [
    { header: 'Shop Name', accessor: 'name' },
    { header: 'Revenue', accessor: 'revenue' },
    {
        header: 'Status',
        render: (row) => <StatusBadge status={row.status} />
    },
    { header: 'Growth', accessor: 'growth' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="card p-6 bg-gradient-to-r from-[#673DE6] to-[#9333ea]">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray mb-2">Hello, Admin! 👋</h2>
                        <p className="text-gray">Welcome back to your SaaS dashboard. Here&apos;s what&apos;s happening today.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                            <p className="text-gray text-sm">System Status</p>
                            <p className="text-gray font-bold text-xl">All Systems Operational</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Businesses"
                    value="156"
                    trend="up"
                    trendValue="12%"
                    color="purple"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Active Subscribers"
                    value="89"
                    trend="up"
                    trendValue="8%"
                    color="green"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Inactive Subscribers"
                    value="67"
                    trend="down"
                    trendValue="3%"
                    color="yellow"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Total Revenue"
                    value="$45,230"
                    trend="up"
                    trendValue="18%"
                    color="blue"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Performing Shops */}
                <div className="lg:col-span-2 card">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Top Performing Shops</h3>
                        <p className="text-sm text-gray-500">Best performing businesses this month</p>
                    </div>
                    <DataTable columns={shopColumns} data={topShops} />
                </div>

                {/* System Analytics Placeholder */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Real-time Analytics</h3>
                        <p className="text-sm text-gray-500">System usage overview</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">API Requests</span>
                                    <span className="font-medium">78%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#673DE6] rounded-full" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Database Load</span>
                                    <span className="font-medium">45%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Storage Used</span>
                                    <span className="font-medium">62%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Bandwidth</span>
                                    <span className="font-medium">35%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
