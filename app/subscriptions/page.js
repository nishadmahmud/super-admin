import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';

// Package data with full features
const packages = [
    {
        name: 'Basic',
        price: '$9',
        period: '/month',
        features: {
            users: 5,
            products: 100,
            invoices: 500,
            reporting: 'Basic',
        },
        subscribers: 45,
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        popular: true,
        features: {
            users: 15,
            products: 1000,
            invoices: 2000,
            reporting: 'Advanced',
        },
        subscribers: 32,
    },
    {
        name: 'Premium',
        price: '$59',
        period: '/month',
        features: {
            users: 50,
            products: 10000,
            invoices: 'Unlimited',
            reporting: 'Full Analytics',
        },
        subscribers: 18,
    },
    {
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        enterprise: true,
        features: {
            users: 'Unlimited',
            products: 'Unlimited',
            invoices: 'Unlimited',
            reporting: 'Priority + Custom',
        },
        subscribers: 8,
    },
];

// Active subscriptions with detailed info
const subscriptions = [
    { id: 1, shop: 'TechMart Electronics', package: 'Premium', expiry: 'Jan 15, 2025', daysLeft: 32, autoRenew: true, status: 'active', lastPayment: 'Dec 15, 2024' },
    { id: 2, shop: 'Fashion Hub', package: 'Pro', expiry: 'Jan 20, 2025', daysLeft: 37, autoRenew: true, status: 'active', lastPayment: 'Dec 20, 2024' },
    { id: 3, shop: 'Green Grocers', package: 'Basic', expiry: 'Dec 25, 2024', daysLeft: 11, autoRenew: false, status: 'expiring', lastPayment: 'Nov 25, 2024' },
    { id: 4, shop: 'Book Haven', package: 'Pro', expiry: 'Dec 18, 2024', daysLeft: 4, autoRenew: true, status: 'expiring', lastPayment: 'Nov 18, 2024' },
    { id: 5, shop: 'Sports Zone', package: 'Premium', expiry: 'Feb 1, 2025', daysLeft: 49, autoRenew: true, status: 'active', lastPayment: 'Jan 1, 2025' },
    { id: 6, shop: 'Gadget Galaxy', package: 'Enterprise', expiry: 'Dec 10, 2024', daysLeft: -4, autoRenew: false, status: 'expired', lastPayment: 'Nov 10, 2024' },
];

// Upcoming renewals
const upcomingRenewals = [
    { shop: 'Book Haven', package: 'Pro', date: 'Dec 18, 2024', daysLeft: 4, amount: '$29' },
    { shop: 'Green Grocers', package: 'Basic', date: 'Dec 25, 2024', daysLeft: 11, amount: '$9' },
    { shop: 'TechMart Electronics', package: 'Premium', date: 'Jan 15, 2025', daysLeft: 32, amount: '$59' },
];

// Failed payments
const failedPayments = [
    { shop: 'Gadget Galaxy', package: 'Enterprise', date: 'Dec 10, 2024', amount: '$99', attempts: 3 },
    { shop: 'Coffee Corner', package: 'Basic', date: 'Dec 8, 2024', amount: '$9', attempts: 2 },
];

const subColumns = [
    { header: 'Shop', accessor: 'shop' },
    {
        header: 'Package', render: (row) => (
            <span className={`px-2 py-1 rounded text-xs font-medium ${row.package === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                row.package === 'Premium' ? 'bg-blue-100 text-blue-700' :
                    row.package === 'Pro' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                }`}>
                {row.package}
            </span>
        )
    },
    { header: 'Expiry Date', accessor: 'expiry' },
    {
        header: 'Days Left', render: (row) => (
            <span className={`font-medium ${row.daysLeft <= 0 ? 'text-red-600' :
                row.daysLeft <= 7 ? 'text-amber-600' :
                    'text-gray-700'
                }`}>
                {row.daysLeft <= 0 ? 'Expired' : `${row.daysLeft} days`}
            </span>
        )
    },
    {
        header: 'Auto Renew',
        render: (row) => (
            <div className="flex items-center gap-2">
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${row.autoRenew ? 'bg-[#673DE6]' : 'bg-gray-300'}`}>
                    <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform ${row.autoRenew ? 'left-5' : 'left-0.5'}`}></div>
                </div>
                <span className="text-sm text-gray-500">{row.autoRenew ? 'On' : 'Off'}</span>
            </div>
        )
    },
    {
        header: 'Status',
        render: (row) => <StatusBadge status={row.status} />
    },
    {
        header: 'Actions',
        render: () => (
            <button className="text-[#673DE6] hover:underline text-sm font-medium">
                Manage
            </button>
        )
    },
];

export default function SubscriptionsPage() {
    return (
        <div className="space-y-6">
            {/* Package Cards */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Subscription Packages</h2>
                        <p className="text-sm text-gray-500">Manage and configure subscription tiers</p>
                    </div>
                    <button className="px-4 py-2 bg-[#673DE6] text-white rounded-lg text-sm font-medium hover:bg-[#5a35cc] transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Package
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg, idx) => (
                        <div
                            key={idx}
                            className="card p-6 relative"
                            style={pkg.enterprise ? { background: 'linear-gradient(to bottom right, #673DE6, #9333ea)' } : {}}
                        >
                            {pkg.popular && (
                                <span className="absolute -top-3 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    Popular
                                </span>
                            )}
                            <h3 style={{ color: pkg.enterprise ? '#ffffff' : '#111827' }} className="text-lg font-bold">
                                {pkg.name}
                            </h3>
                            <div className="mt-3">
                                <span style={{ color: pkg.enterprise ? '#ffffff' : '#111827' }} className="text-3xl font-bold">
                                    {pkg.price}
                                </span>
                                <span style={{ color: pkg.enterprise ? 'rgba(255,255,255,0.8)' : '#6b7280' }}>
                                    {pkg.period}
                                </span>
                            </div>

                            {/* Features List */}
                            <div style={{ color: pkg.enterprise ? 'rgba(255,255,255,0.9)' : '#4b5563' }} className="mt-5 space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Users
                                    </span>
                                    <span className="font-medium">{pkg.features.users}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Products
                                    </span>
                                    <span className="font-medium">{pkg.features.products}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Invoices/mo
                                    </span>
                                    <span className="font-medium">{pkg.features.invoices}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Reporting
                                    </span>
                                    <span className="font-medium text-xs">{pkg.features.reporting}</span>
                                </div>
                            </div>

                            <div style={{ borderColor: pkg.enterprise ? 'rgba(255,255,255,0.3)' : '#f3f4f6' }} className="mt-5 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <p style={{ color: pkg.enterprise ? 'rgba(255,255,255,0.8)' : '#6b7280' }} className="text-sm">
                                        {pkg.subscribers} subscribers
                                    </p>
                                    <button style={{ color: pkg.enterprise ? '#ffffff' : '#673DE6' }} className="text-sm font-medium hover:opacity-80">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Subscriptions Table */}
            <div className="card">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
                        <p className="text-sm text-gray-500">Manage shop assignments and renewal settings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#673DE6]/20 focus:border-[#673DE6]">
                            <option>All Packages</option>
                            <option>Basic</option>
                            <option>Pro</option>
                            <option>Premium</option>
                            <option>Enterprise</option>
                        </select>
                        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#673DE6]/20 focus:border-[#673DE6]">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Expiring</option>
                            <option>Expired</option>
                        </select>
                    </div>
                </div>
                <DataTable columns={subColumns} data={subscriptions} />
            </div>

            {/* Bottom Grid: Upcoming Renewals & Failed Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Renewals */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Upcoming Renewals</h3>
                            <p className="text-sm text-gray-500">Subscriptions renewing soon</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {upcomingRenewals.length} pending
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {upcomingRenewals.map((item, idx) => (
                            <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.shop}</p>
                                        <p className="text-sm text-gray-500">{item.package} • Renews {item.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{item.amount}</p>
                                        <p className={`text-xs font-medium ${item.daysLeft <= 7 ? 'text-amber-600' : 'text-gray-500'}`}>
                                            {item.daysLeft} days left
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                        <button className="text-sm text-[#673DE6] font-medium hover:underline">
                            View all renewals →
                        </button>
                    </div>
                </div>

                {/* Failed Payments */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Failed Payments</h3>
                            <p className="text-sm text-gray-500">Requires immediate attention</p>
                        </div>
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            {failedPayments.length} failed
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {failedPayments.map((item, idx) => (
                            <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.shop}</p>
                                            <p className="text-sm text-gray-500">{item.package} • {item.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-red-600">{item.amount}</p>
                                        <p className="text-xs text-gray-500">{item.attempts} attempts</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button className="px-3 py-1.5 bg-[#673DE6] text-white text-xs font-medium rounded-lg hover:bg-[#5a35cc] transition-colors">
                                        Retry Payment
                                    </button>
                                    <button className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                        Contact Shop
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {failedPayments.length === 0 && (
                        <div className="px-6 py-8 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No failed payments</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Package Expiration Reminders */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Expiration Reminders</h3>
                        <p className="text-sm text-gray-500">Automated notification settings</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Configure
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">30 Days Before</span>
                        </div>
                        <p className="text-sm text-gray-600">First reminder email sent</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">7 Days Before</span>
                        </div>
                        <p className="text-sm text-gray-600">Urgent reminder + in-app alert</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">1 Day Before</span>
                        </div>
                        <p className="text-sm text-gray-600">Final warning + SMS notification</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
