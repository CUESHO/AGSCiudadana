import Navbar from './Navbar';

export default function Layout({ children, activeTab, setActiveTab }) {
    return (
        <div className="h-[100dvh] w-full bg-gray-100 flex justify-center overflow-hidden">
            <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col">
                <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    {children}
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
                    <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>
        </div>
    );
}
