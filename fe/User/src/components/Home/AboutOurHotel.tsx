import { useEffect, useState } from "react";
import type { SystemContent } from "../../type/systemContent.types";
import { getByContentKey } from "../../service/api/systemContent";
import { File_URL } from "../../setting/constant/app";

const AboutOurHotel = () => {
  const [settingContent, setSettingContent] = useState<SystemContent | null>(
    null,
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getByContentKey(1);
        setSettingContent(response.data?.data || null);
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  if (!settingContent) return null;
  const description = settingContent.description || "";
  const paragraphs = description.split("\r");

  const firstParagraph = paragraphs[0] || "";
  const firstChar = firstParagraph.charAt(0);
  const restFirstParagraph = firstParagraph.slice(1);

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background */}
      <img
        src={File_URL + settingContent.backgroundImage.url}
        alt={settingContent.backgroundImage.altText}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay nhẹ để đọc chữ rõ */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 h-full">
        <div
          className="
         absolute
    left-1/2
    top-1/2
    -translate-x-1/2
    -translate-y-2/2
    mt-9

    w-[92%]

    sm:translate-x-0
    sm:translate-y-0
    sm:left-auto
    sm:top-auto
    sm:right-10
    lg:right-20
    sm:bottom-10
    lg:bottom-16

    sm:max-w-[550px]
    lg:max-w-[653px]

    bg-white/85
    sm:bg-white/70

    backdrop-blur-sm
    sm:backdrop-blur-lg

    rounded-2xl
    p-5
    sm:p-8
    shadow-lg
    sm:shadow-2xl
      "
        >
          {/* Title */}
          <h2
            className="
        text-2xl
        sm:text-3xl
        lg:text-[42px]
        font-dmserif
        text-[#253150]
        mb-4
      "
          >
            {settingContent.title ?? "About Our Hotel"}
          </h2>

          {/* First paragraph */}
          <p
            className="
        text-sm
        sm:text-base
        font-montserrat
        text-gray-700
        leading-relaxed
      "
          >
            <span
              className="
          float-left
          text-4xl
          sm:text-5xl
          font-dmserif
          text-[#2E3A59]
          mr-2
          leading-none
        "
            >
              {firstChar}
            </span>
            {restFirstParagraph}
          </p>

          {/* Remaining paragraphs */}
          {paragraphs.slice(1).map((p, idx) => (
            <p
              key={idx}
              className="mt-4 text-sm sm:text-base font-montserrat text-gray-700 leading-relaxed"
            >
              {p}
            </p>
          ))}

          {/* CTA */}
          {settingContent.ctaText && (
            <button
              className="
            mt-6
            w-full
            border-y border-[#42578E]
            font-montserrat
            text-[#1D263E]
            text-sm sm:text-base
            py-3
            flex items-center gap-3
            hover:bg-white/40
            transition
          "
            >
              <img
                src="/image/VectorBlack.png"
                alt="Vector"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              {settingContent.ctaText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
export default AboutOurHotel;
