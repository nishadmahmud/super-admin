'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
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
    const [usersList, setUsersList] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeFilter, setActiveFilter] = useState('active');
    const [filterTitle, setFilterTitle] = useState('Active Users');

    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 6,
        from: 0,
        to: 0
    });

    // Cache for summary and user pages
    const cacheRef = useRef({
        summary: null,
        pages: {}, // { 'active_1': { users: [], pagination: {} }, ... }
        lastFetchTime: null
    });

    const getCacheKey = (filter, page) => `${filter}_${page}`;

    const CACHE_DURATION = 5 * 60 * 1000;

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const user = getUser();
        setCurrentUser(user);
        fetchDashboardData();
    }, [router]);

    const isCacheValid = () => {
        if (!cacheRef.current.lastFetchTime) return false;
        return (Date.now() - cacheRef.current.lastFetchTime) < CACHE_DURATION;
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (isCacheValid() && cacheRef.current.summary) {
                setStats(cacheRef.current.summary);
            } else {
                const summaryResponse = await getUserSummary();
                const summaryData = summaryResponse?.data || summaryResponse;
                if (summaryData) {
                    const newStats = {
                        totalBusinesses: summaryData.total || summaryData.total_users || 0,
                        activeSubscribers: summaryData.active || summaryData.active_users || 0,
                        inactiveSubscribers: summaryData.inactive || summaryData.inactive_users || 0,
                        totalRevenue: summaryData.total_revenue || summaryData.revenue || 0,
                    };
                    setStats(newStats);
                    cacheRef.current.summary = newStats;
                    cacheRef.current.lastFetchTime = Date.now();
                }
            }

            await fetchUsersByStatus('active', 1);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersByStatus = async (filter, page = 1) => {
        setActiveFilter(filter);
        setFilterTitle(filter === 'active' ? 'Active Users' : 'Inactive Users');

        // Check cache first
        const cacheKey = getCacheKey(filter, page);
        if (isCacheValid() && cacheRef.current.pages && cacheRef.current.pages[cacheKey]) {
            const cached = cacheRef.current.pages[cacheKey];
            setUsersList(cached.users);
            setPagination(cached.pagination);
            return; // Instant display, no loading
        }

        // Not cached, fetch from API
        setUsersLoading(true);

        try {
            const statusValue = filter === 'active' ? 1 : 0;
            const response = await getStatusWiseUsers(statusValue, 6, page);

            const data = response?.data;
            if (data) {
                const paginationData = {
                    currentPage: data.current_page || 1,
                    lastPage: data.last_page || 1,
                    total: data.total || 0,
                    perPage: data.per_page || 6,
                    from: data.from || 0,
                    to: data.to || 0
                };
                setPagination(paginationData);

                const usersArray = Array.isArray(data.data) ? data.data : [];
                setUsersList(usersArray);

                // Cache this page (ensure pages object exists)
                if (!cacheRef.current.pages) {
                    cacheRef.current.pages = {};
                }
                cacheRef.current.pages[cacheKey] = {
                    users: usersArray,
                    pagination: paginationData
                };
                cacheRef.current.lastFetchTime = Date.now();
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setUsersLoading(false);
        }
    };

    const handleStatsClick = (type) => {
        if (type === 'active') {
            fetchUsersByStatus('active', 1);
        } else if (type === 'inactive') {
            fetchUsersByStatus('inactive', 1);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            fetchUsersByStatus(activeFilter, page);
        }
    };

    const goToPrevPage = () => goToPage(pagination.currentPage - 1);
    const goToNextPage = () => goToPage(pagination.currentPage + 1);

    const getPageNumbers = () => {
        const pages = [];
        const { currentPage, lastPage } = pagination;

        if (lastPage <= 5) {
            for (let i = 1; i <= lastPage; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', lastPage);
            } else if (currentPage >= lastPage - 2) {
                pages.push(1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage);
            }
        }
        return pages;
    };

    // Format date nicely
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin w-8 h-8 text-[#673DE6]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span style={{ color: '#4b5563' }}>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="card p-6" style={{ background: 'linear-gradient(to right, #673DE6, #9333ea)' }}>
                <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>
                        Hello, {currentUser?.owner_name || 'Admin'}! 👋
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Welcome to your dashboard.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                    <strong>Note:</strong> {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Businesses"
                    value={stats.totalBusinesses.toLocaleString()}
                    color="purple"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                />
                <div onClick={() => handleStatsClick('active')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                    <StatsCard
                        title="Active Subscribers"
                        value={stats.activeSubscribers.toLocaleString()}
                        color="green"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                </div>
                <div onClick={() => handleStatsClick('inactive')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                    <StatsCard
                        title="Inactive Subscribers"
                        value={stats.inactiveSubscribers.toLocaleString()}
                        color="yellow"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Users Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>{filterTitle}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Showing {pagination.from}-{pagination.to} of {pagination.total} users
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => fetchUsersByStatus('active', 1)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeFilter === 'active' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => fetchUsersByStatus('inactive', 1)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeFilter === 'inactive' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            Inactive
                        </button>
                    </div>
                    <button
                        onClick={() => fetchUsersByStatus(activeFilter, pagination.currentPage)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <svg className={`w-5 h-5 text-gray-500 ${usersLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Users Cards Grid - 3 per row, 6 per page */}
            {usersLoading ? (
                <div className="flex items-center justify-center py-16">
                    <svg className="animate-spin w-10 h-10 text-[#673DE6]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {usersList.map((user) => (
                        <div key={user.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Card Header with Cover & Profile */}
                            <div className="relative">
                                {/* Cover Image */}
                                <div
                                    className="h-24"
                                    style={{
                                        background: user.cover_pic
                                            ? `url(${user.cover_pic}) center/cover`
                                            : 'linear-gradient(to right, #673DE6, #9333ea)'
                                    }}
                                />
                                {/* Profile Picture */}
                                <div className="absolute -bottom-8 left-4">
                                    {user.profile_pic ? (
                                        <img
                                            src={user.profile_pic}
                                            alt={user.owner_name}
                                            className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-md"
                                        />
                                    ) : (
                                        <div
                                            className="w-16 h-16 rounded-xl border-4 border-white shadow-md flex items-center justify-center"
                                            style={{ background: 'linear-gradient(to bottom right, #a855f7, #ec4899)' }}
                                        >
                                            <span style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                                {user.owner_name?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={user.status === 1 ? 'active' : 'inactive'} />
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="pt-10 px-4 pb-4">
                                {/* Name & Outlet */}
                                <h4 style={{ color: '#111827', fontSize: '1rem', fontWeight: '600', marginBottom: '2px' }}>
                                    {user.owner_name || 'Unknown'}
                                </h4>
                                <p style={{ color: '#673DE6', fontSize: '0.875rem', fontWeight: '500', marginBottom: '12px' }}>
                                    {user.outlet_name || 'No Outlet'}
                                </p>

                                {/* Info Grid */}
                                <div className="space-y-2 text-sm">
                                    {/* Email */}
                                    {user.email && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span style={{ color: '#4b5563', wordBreak: 'break-all' }}>{user.email}</span>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {user.phone && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span style={{ color: '#4b5563' }}>{user.phone}</span>
                                        </div>
                                    )}

                                    {/* Web Address */}
                                    {user.web_address && user.web_address !== 'null' && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                            <a
                                                href={user.web_address.startsWith('http') ? user.web_address : `https://${user.web_address}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#673DE6' }}
                                                className="hover:underline truncate"
                                            >
                                                {user.web_address}
                                            </a>
                                        </div>
                                    )}

                                    {/* Address */}
                                    {user.address && user.address !== 'null' && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span style={{ color: '#4b5563' }}>{user.address}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-100 mt-3 pt-3">
                                    {/* Additional Info Row */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {user.zipcode && user.zipcode !== 'null' && (
                                            <div>
                                                <span style={{ color: '#9ca3af' }}>Zipcode</span>
                                                <p style={{ color: '#4b5563', fontWeight: '500' }}>{user.zipcode}</p>
                                            </div>
                                        )}
                                        {user.type && (
                                            <div>
                                                <span style={{ color: '#9ca3af' }}>Type</span>
                                                <p style={{ color: '#4b5563', fontWeight: '500' }}>
                                                    {user.type === '3' ? 'Business' : `Type ${user.type}`}
                                                </p>
                                            </div>
                                        )}
                                        {user.multibranch && user.multibranch !== 'null' && (
                                            <div>
                                                <span style={{ color: '#9ca3af' }}>Multi-branch</span>
                                                <p style={{ color: '#4b5563', fontWeight: '500' }}>{user.multibranch}</p>
                                            </div>
                                        )}
                                        {user.trade_license && user.trade_license !== 'null' && (
                                            <div>
                                                <span style={{ color: '#9ca3af' }}>Trade License</span>
                                                <p style={{ color: '#4b5563', fontWeight: '500' }}>{user.trade_license}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer - Dates */}
                                <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between text-xs">
                                    <div>
                                        <span style={{ color: '#9ca3af' }}>Created</span>
                                        <p style={{ color: '#4b5563' }}>{formatDate(user.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <span style={{ color: '#9ca3af' }}>ID: {user.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {pagination.lastPage > 1 && (
                <div className="card px-6 py-4 flex items-center justify-between">
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Page {pagination.currentPage} of {pagination.lastPage}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={goToPrevPage}
                            disabled={pagination.currentPage === 1}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${pagination.currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            ← Previous
                        </button>

                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && goToPage(page)}
                                disabled={page === '...'}
                                className={`w-8 h-8 text-sm font-medium rounded-md transition-colors ${page === pagination.currentPage
                                    ? 'bg-[#673DE6] text-white'
                                    : page === '...'
                                        ? 'text-gray-400 cursor-default'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={goToNextPage}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${pagination.currentPage === pagination.lastPage
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
