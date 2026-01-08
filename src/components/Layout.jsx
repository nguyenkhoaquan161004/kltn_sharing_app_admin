import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-auto md:ml-64">
                <div className="p-4 md:p-8">{children}</div>
            </main>
        </div>
    );
}
