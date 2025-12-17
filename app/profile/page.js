'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getToken } from '../lib/api';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const userData = getUser();
        setUser(userData);
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
                    <span className="text-gray-600">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No user data available</p>
            </div>
        );
    }

    const invoiceSettings = user.invoice_settings;
    const currencyInfo = invoiceSettings?.currency_info;

    return (
        <div className="space-y-6">
            {/* Cover & Profile Header */}
            <div className="card overflow-hidden">
                {/* Cover Image */}
                <div
                    className="h-48 bg-gradient-to-r from-[#673DE6] to-[#9333ea] relative"
                    style={user.cover_pic ? { backgroundImage: `url(${user.cover_pic})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 relative z-10">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            {user.profile_pic ? (
                                <img
                                    src={user.profile_pic}
                                    alt={user.owner_name || 'Profile'}
                                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-white shadow-lg">
                                    <span className="text-white text-4xl font-bold">
                                        {user.owner_name?.charAt(0) || 'A'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Name & Basic Info */}
                        <div className="flex-1 pt-4 md:pt-0">
                            <h1 className="text-2xl font-bold text-gray-900">{user.owner_name || 'User'}</h1>
                            <p className="text-lg text-[#673DE6] font-medium">{user.outlet_name || 'Business'}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                {user.email && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {user.email}
                                    </span>
                                )}
                                {user.phone && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {user.phone}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${user.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {user.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Information */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#673DE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Business Information
                    </h2>
                    <div className="space-y-4">
                        <InfoRow label="Outlet Name" value={user.outlet_name} />
                        <InfoRow label="Owner Name" value={user.owner_name} />
                        <InfoRow label="Web Address" value={user.web_address} isLink />
                        <InfoRow label="Address" value={user.address} />
                        <InfoRow label="Zipcode" value={user.zipcode} />
                        <InfoRow label="UUID" value={user.uuid} isMono />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#673DE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Information
                    </h2>
                    <div className="space-y-4">
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Phone" value={user.phone} />
                        <InfoRow label="Contact Number" value={user.contact_number || invoiceSettings?.mobile_number} />
                        <InfoRow label="Additional Email" value={invoiceSettings?.addtional_email} />
                        <InfoRow label="Additional Mobile" value={invoiceSettings?.additional_mobile_number} />
                    </div>
                </div>

                {/* Invoice Settings */}
                {invoiceSettings && (
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#673DE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Invoice Settings
                        </h2>
                        <div className="space-y-4">
                            {invoiceSettings.shop_logo && (
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={invoiceSettings.shop_logo} alt="Shop Logo" className="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2" />
                                    <div>
                                        <p className="font-medium text-gray-900">{invoiceSettings.shop_name}</p>
                                        <p className="text-sm text-gray-500">{invoiceSettings.slogan}</p>
                                    </div>
                                </div>
                            )}
                            <InfoRow label="Shop Address" value={invoiceSettings.shop_address} />
                            <InfoRow label="Authority Name" value={invoiceSettings.name_authority} />
                            <InfoRow label="VAT" value={invoiceSettings.vat ? `${invoiceSettings.vat}%` : 'N/A'} />
                            <InfoRow label="Tax" value={invoiceSettings.tax ? `${invoiceSettings.tax}%` : 'N/A'} />
                            <InfoRow label="Trade License" value={invoiceSettings.trade_license} />
                        </div>
                    </div>
                )}

                {/* Currency & Payment Info */}
                {currencyInfo && (
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#673DE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Currency Settings
                        </h2>
                        <div className="space-y-4">
                            <InfoRow label="Currency" value={currencyInfo.name} />
                            <InfoRow label="Symbol" value={currencyInfo.symbol} />
                            <InfoRow label="Code" value={currencyInfo.code} />
                            <InfoRow label="Exchange Rate" value={currencyInfo.exchange_rate} />
                        </div>
                    </div>
                )}
            </div>

            {/* Social Links */}
            {(invoiceSettings?.social_link || invoiceSettings?.social_link2) && (
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#673DE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Social Links
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {invoiceSettings.social_link && (
                            <a
                                href={invoiceSettings.social_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </a>
                        )}
                        {invoiceSettings.social_link2 && (
                            <a
                                href={invoiceSettings.social_link2}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Account Details */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#673DE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="User ID" value={user.id} />
                    <InfoRow label="Account Type" value={user.type === '3' ? 'Business' : `Type ${user.type}`} />
                    <InfoRow label="Created At" value={user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'} />
                    <InfoRow label="Last Updated" value={user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'} />
                    <InfoRow label="OTP Verified" value={user.otp_verified_ind === 1 ? 'Yes' : 'No'} />
                    <InfoRow label="Multi-branch" value={user.multibranch !== 'null' ? user.multibranch : 'No'} />
                </div>
            </div>
        </div>
    );
}

// Info Row Component
function InfoRow({ label, value, isLink = false, isMono = false }) {
    if (!value || value === 'null') return null;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm text-gray-500 sm:w-1/3">{label}</span>
            {isLink ? (
                <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#673DE6] hover:underline truncate">
                    {value}
                </a>
            ) : (
                <span className={`text-sm font-medium text-gray-900 truncate ${isMono ? 'font-mono text-xs' : ''}`}>
                    {value}
                </span>
            )}
        </div>
    );
}
