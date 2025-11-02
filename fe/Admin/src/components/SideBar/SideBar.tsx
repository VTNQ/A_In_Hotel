import { SECTIONS } from "./Section";
import SideBarItem from "./SideBarItem";

const SideBar = () => {
    return (
        <aside className="flex flex-col h-screen w-64 bg-[#1D263E] text-white">
            <div className="flex flex-col items-start py-6 border-b border-gray-700 ml-4">
                <img
                    src="/asset/logo-ainhotel.png"
                    alt="A-IN HOTEL VIETNAM"
                    className="w-36 h-auto object-contain"
                />
            </div>
            <nav className="flex-1 mt-4 overflow-y-auto px-3 custom-scrollbar">
                {SECTIONS.map((section, i) => (
                    <div key={i}>
                        {section.title && (
                            <h2 className="px-4 text-xs uppercase text-gray-500 mb-1">
                                {section.title}
                            </h2>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item, j) => (
                                <SideBarItem key={j} item={item} />
                            ))}
                        </div>
                        {i === 0 && (
                            <div className="border-t border-gray-700 my-3 mx-4"></div>
                        )}

                    </div>
                ))}
            </nav>
            <div className="mt-auto px-3 py-3">
                <img
                    src="/asset/map.png"
                    alt="map"
                    className="opacity-70"
                />
            </div>
        </aside>
    )
}
export default SideBar;