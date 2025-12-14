import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';

// Ticket data
const tickets = [
    { id: 'TKT-001', subject: 'Payment gateway not working', shop: 'TechMart Electronics', priority: 'high', status: 'open', created: '2 hours ago' },
    { id: 'TKT-002', subject: 'Cannot add new products', shop: 'Fashion Hub', priority: 'medium', status: 'open', created: '5 hours ago' },
    { id: 'TKT-003', subject: 'Report generation error', shop: 'Green Grocers', priority: 'low', status: 'pending', created: '1 day ago' },
    { id: 'TKT-004', subject: 'Need to upgrade plan', shop: 'Book Haven', priority: 'medium', status: 'resolved', created: '2 days ago' },
    { id: 'TKT-005', subject: 'Invoice template customization', shop: 'Sports Zone', priority: 'low', status: 'resolved', created: '3 days ago' },
    { id: 'TKT-006', subject: 'User access issue', shop: 'Gadget Galaxy', priority: 'high', status: 'open', created: '4 hours ago' },
];

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
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Open Tickets"
                    value="12"
                    color="blue"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="In Progress"
                    value="5"
                    color="yellow"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Resolved"
                    value="89"
                    color="green"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Unresolved"
                    value="3"
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
                <DataTable columns={ticketColumns} data={tickets} />
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
                                <div className="h-full bg-red-500 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">3</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium text-amber-600">Medium</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">5</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium text-blue-600">Low</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '33%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">4</span>
                        </div>
                    </div>
                </div>

                {/* Unresolved by Tenant */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Unresolved Issues by Shop</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 font-bold text-sm">2</span>
                                </div>
                                <span className="font-medium text-gray-900">TechMart Electronics</span>
                            </div>
                            <StatusBadge status="high" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 font-bold text-sm">1</span>
                                </div>
                                <span className="font-medium text-gray-900">Fashion Hub</span>
                            </div>
                            <StatusBadge status="medium" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
