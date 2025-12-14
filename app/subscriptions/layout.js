import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function SubscriptionsLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Sidebar />
            <div className="ml-[260px]">
                <Header title="Subscriptions" />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
