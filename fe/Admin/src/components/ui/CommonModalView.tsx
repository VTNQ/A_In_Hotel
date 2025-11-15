import { X } from "lucide-react";
import type { CommonModalViewProps } from "../../type";

const CommonModalView: React.FC<CommonModalViewProps> = ({
    isOpen,
    title = "Modal Title",
    children,
    onClose,
    tabs = [],
    activeTab,
    onTabChange,
    width = "w-[500px]",
    isBorderBottom,
    widthClose = "w-[200px]",
    withCenter = "text-center"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
                className={`bg-white rounded-3xl shadow-xl ${width} max-w-full flex flex-col max-h-[90vh]`}
            >
                {/* HEADER */}
                <div className={`relative px-6 pt-8 pb-4 bg-white rounded-2xl ${isBorderBottom ? "border-b border-[#C2C4C5]" : ""
                    }`}
                >
                    <h2 className={`text-[27px] font-semibold  text-[#1F2945] ${withCenter}`}>
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="
      absolute right-6 top-8 
      w-7 h-7 flex items-center justify-center
      border border-[#2E3A8C]
      text-[#2E3A8C]
      rounded-lg
      hover:bg-[#f2f4ff]
      transition
    "
                    >
                        <X size={17} strokeWidth={2} />
                    </button>

                    {/* TABS */}
                    {tabs.length > 0 && (
                        <div className="mt-4 flex justify-center">

                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => onTabChange?.(tab.key)}
                                    className={`
      text-[16px] font-semibold pb-1 w-[250px] transition mb-[-10px]
      ${activeTab === tab.key
                                            ? "text-[#1F2945] border-b-2 border-[#1F2945]"
                                            : "text-[#8A8FA3] hover:text-[#253150]"
                                        }
    `}
                                >
                                    {tab.label}
                                </button>
                            ))}


                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto px-6">{children}</div>

                {/* FOOTER (only Close button) */}
                <div className="px-6 py-5 bg-white flex justify-end rounded-2xl">
                    <button
                        onClick={onClose}
                        className={`w-[200px]          
                ${widthClose}   
                h-[40px]
                rounded-xl 
               bg-[#42578E] 
                 text-white
                 text-[16px]
                font-medium
              hover:bg-[#333d6e]
                transition
                shadow-sm`}
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CommonModalView;