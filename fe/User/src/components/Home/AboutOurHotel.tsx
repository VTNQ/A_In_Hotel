import { useEffect, useState } from "react";
import type { SystemContent } from "../../type/systemContent.types";
import { getByContentKey } from "../../service/api/systemContent";
import { File_URL } from "../../setting/constant/app";

const AboutOurHotel = () => {
    const [settingContent, setSettingContent] = useState<SystemContent | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getByContentKey(1);
                setSettingContent(response.data?.data || null);

            } catch (err: any) {
                console.log(err)
            }
        }
        fetchData();
    }, []);
    if (!settingContent) return null;
    const description = settingContent.description || "";
    const paragraphs = description.split("\r");

    const firstParagraph = paragraphs[0] || "";
    const firstChar = firstParagraph.charAt(0);
    const restFirstParagraph = firstParagraph.slice(1);
    

    return (
        <section className="relative w-full h-[700px] overflow-hidden">
            <img
                src={File_URL + settingContent.backgroundImage.url}
                alt={settingContent.backgroundImage.altText}
                className="absolute inset-0 w-full h-full object-cover"
                

            />
            <div className="relative z-10 h-full flex items-end">
                <div className="absolute right-[16%] bottom-[5%] w-[653px] bg-white/40 backdrop-blur-[20px] rounded-[12px] p-[10px]"
                >
                    <h2 className="text-[48px] font-dmserif text-[#253150] mb-4 text-left">
                        {settingContent.title ?? "About Our Hotel"}
                    </h2>
                    <p className="text-[16px] font-montserrat font-medium text-gray-700 leading-relaxed">
                        <span className="float-left text-5xl font-dmserif text-[#2E3A59] mr-2 leading-none">
                            {firstChar}
                        </span>
                        {restFirstParagraph}

                    </p>
                    {paragraphs.slice(1).map((p, idx) => (
                        <p key={idx} className="mt-4 font-montserrat">
                            {p}
                        </p>
                    ))}
                    {settingContent.ctaText && (
                        <button
                            className="border-t-[0.5px] border-b-[0.5px] border-[#42578E] 
                            font-montserrat text-[#1D263E] text-[20px] 
                            leading-5 mt-5 inline-flex items-center gap-2 w-full py-2"
                        >
                            <img src="/image/VectorBlack.png" alt="Vector" width={30} height={30} />
                            {settingContent.ctaText}
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}
export default AboutOurHotel;