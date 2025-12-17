'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';
import { getToken } from '../lib/api';

// Empty data - will be populated from API when available
const tickets = [];

const ticketColumns = [
    { header: 'Ticket ID', accessor: 'id' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Shop', accessor: 'shop' },
    {
        header: 'Priority',
        render: (row) => <StatusBadge status={row.priority} />
    },
    {
        header: 'Status',
        render: (row) => <StatusBadge status={row.status} />
    },
    { header: 'Created', accessor: 'created' },
];

export default function SupportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [ticketStats, setTicketStats] = useState({
        open: 0,
        inProgress: 0,
        resolved: 0,
        unresolved: 0,
    });
    const [ticketList, setTicketList] = useState([]);
    const [priorityBreakdown, setPriorityBreakdown] = useState({ high: 0, medium: 0, low: 0 });
    const [unresolvedByShop, setUnresolvedByShop] = useState([]);

    useEffect(() => {
        // Check authentication
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        // TODO: Fetch support data from API when endpoint is available
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin w-8 h-8 text-[#673DE6]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Loading support data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Open Tickets"
                    value={ticketStats.open.toString()}
                    color="blue"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="In Progress"
                    value={ticketStats.inProgress.toString()}
                    color="yellow"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Resolved"
                    value={ticketStats.resolved.toString()}
                    color="green"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Unresolved"
                    value={ticketStats.unresolved.toString()}
                    color="red"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Tickets Section */}
            <div className="card">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">All Tickets</h3>
                        <p className="text-sm text-gray-500">Manage and respond to support requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Filter Buttons */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#673DE6] rounded-md">
                                All
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md transition-colors">
                                Open
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md transition-colors">
                                Resolved
                            </button>
                        </div>
                        {/* Search */}
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#673DE6]/20 focus:border-[#673DE6] transition-all w-48"
                            />
                        </div>
                    </div>
                </div>
                <DataTable columns={ticketColumns} data={ticketList} />
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority Breakdown */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium text-red-600">High</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: priorityBreakdown.high > 0 ? `${(priorityBreakdown.high / (priorityBreakdown.high + priorityBreakdown.medium + priorityBreakdown.low)) * 100}%` : '0%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{priorityBreakdown.high}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium text-amber-600">Medium</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: priorityBreakdown.medium > 0 ? `${(priorityBreakdown.medium / (priorityBreakdown.high + priorityBreakdown.medium + priorityBreakdown.low)) * 100}%` : '0%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{priorityBreakdown.medium}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium text-blue-600">Low</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: priorityBreakdown.low > 0 ? `${(priorityBreakdown.low / (priorityBreakdown.high + priorityBreakdown.medium + priorityBreakdown.low)) * 100}%` : '0%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{priorityBreakdown.low}</span>
                        </div>
                    </div>
                </div>

                {/* Unresolved by Shop */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Unresolved Issues by Shop</h3>
                    {unresolvedByShop.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>No unresolved issues</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {unresolvedByShop.map((item, idx) => (
                                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${item.priority === 'high' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.priority === 'high' ? 'bg-red-100' : 'bg-amber-100'}`}>
                                            <span className={`font-bold text-sm ${item.priority === 'high' ? 'text-red-600' : 'text-amber-600'}`}>{item.count}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{item.shop}</span>
                                    </div>
                                    <StatusBadge status={item.priority} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
