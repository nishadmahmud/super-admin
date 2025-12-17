'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';
import { getUserSummary, getStatusWiseUsers, getUser, getToken } from '../lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalBusinesses: 0,
        activeSubscribers: 0,
        inactiveSubscribers: 0,
        totalRevenue: 0,
    });
    const [topShops, setTopShops] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check authentication
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const user = getUser();
        setCurrentUser(user);

        // Fetch dashboard data
        fetchDashboardData();
    }, [router]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch user summary for stats
            const summaryResponse = await getUserSummary();
            console.log('User Summary Response:', summaryResponse); // Debug log

            // API returns { data: { total, active, inactive } }
            const summaryData = summaryResponse?.data || summaryResponse;
            if (summaryData) {
                setStats({
                    totalBusinesses: summaryData.total || summaryData.total_users || 0,
                    activeSubscribers: summaryData.active || summaryData.active_users || 0,
                    inactiveSubscribers: summaryData.inactive || summaryData.inactive_users || 0,
                    totalRevenue: summaryData.total_revenue || summaryData.revenue || 0,
                });
            }

            // Fetch active users for top shops
            const usersResponse = await getStatusWiseUsers(1, 5);
            // Handle different response structures: could be { data: [] }, { users: [] }, or just []
            const usersData = usersResponse?.data || usersResponse?.users || (Array.isArray(usersResponse) ? usersResponse : null);

            if (usersData && Array.isArray(usersData)) {
                const formattedShops = usersData.map((user, index) => ({
                    id: user.id || index + 1,
                    name: user.outlet_name || user.owner_name || `Shop ${index + 1}`,
                    revenue: user.total_revenue ? `$${user.total_revenue.toLocaleString()}` : '$0',
                    status: user.status === 1 ? 'active' : 'inactive',
                    growth: user.growth || '+0%',
                }));
                setTopShops(formattedShops);
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError(err.message);
            // No fallback data - show empty state
        } finally {
            setLoading(false);
        }
    };

    const shopColumns = [
        { header: 'Shop Name', accessor: 'name' },
        { header: 'Revenue', accessor: 'revenue' },
        { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Growth', accessor: 'growth' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin w-8 h-8 text-[#673DE6]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="card p-6" style={{ background: 'linear-gradient(to right, #673DE6, #9333ea)' }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>
                            Hello, {currentUser?.owner_name || 'Admin'}! 👋
                        </h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Welcome back to your SaaS dashboard. Here&apos;s what&apos;s happening today.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="rounded-xl px-6 py-4 text-center" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>System Status</p>
                            <p className="font-bold text-xl" style={{ color: '#ffffff' }}>All Systems Operational</p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                    <strong>Note:</strong> Could not fetch live data. Showing demo data. {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Businesses"
                    value={stats.totalBusinesses.toLocaleString()}
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
                    value={stats.activeSubscribers.toLocaleString()}
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
                    value={stats.inactiveSubscribers.toLocaleString()}
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
                    value={`$${stats.totalRevenue.toLocaleString()}`}
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
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Top Performing Shops</h3>
                            <p className="text-sm text-gray-500">Best performing businesses this month</p>
                        </div>
                        <button
                            onClick={fetchDashboardData}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh data"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    <DataTable columns={shopColumns} data={topShops} />
                </div>

                {/* System Analytics */}
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
