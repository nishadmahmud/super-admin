import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function SupportLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Sidebar />
            <div className="ml-[260px]">
                <Header title="Support & Tickets" />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
