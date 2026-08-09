const ContactSticky = () => {
  const fbLinks = [
    { name: "Riverside", url: "https://www.facebook.com/ainhotelriverside" },
    { name: "Glamour", url: "https://www.facebook.com/ainhotelglamour" },
    { name: "Delluna", url: "https://www.facebook.com/ainhoteldelluna" },
    { name: "Atistar", url: "https://www.facebook.com/ainhotelatistar" },
  ];

  const zaloLinks = [
    { name: "Glamour", url: "https://zalo.me/2995290453484355017" },
    { name: "Atistar", url: "https://zalo.me/3321323852420568562" },
    { name: "Riverside", url: "https://zalo.me/2064698245345781686" },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3"
    >
      {/* PHONE */}
      <a
        href="tel:0123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full hover:scale-110 transition-transform duration-300"
      >
        <img loading="lazy"
          src="/image/IconPhone.png"
          alt="Call"
          className="h-full w-full object-contain"
        />
      </a>

      {/* ZALO */}
      <div className="group relative flex items-center justify-end">
        <div className="absolute right-[115%] w-36 flex-col p-3 rounded-2xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-[#e3ddd6] opacity-0 invisible translate-x-4 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-300 ease-out z-50">
          {/* Arrow */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-[#e3ddd6] rotate-45"></div>
          
          <p className="text-[10px] font-bold text-[#866F56] tracking-[0.15em] text-center uppercase mb-2 border-b border-[#e3ddd6] pb-2 relative z-10">
            Chọn Zalo
          </p>
          <div className="flex flex-col gap-1 relative z-10">
            {zaloLinks.map((z) => (
              <a key={z.name} href={z.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-center py-2.5 text-[#3A3125] hover:bg-[#f9f6f2] hover:text-[#B38A58] rounded-xl transition-colors">
                {z.name}
              </a>
            ))}
          </div>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-full hover:scale-110 hover:-translate-x-1 transition-all duration-300 relative z-10">
          <img loading="lazy"
            src="/image/IconZalo.png"
            alt="Zalo"
            className="h-full w-full object-contain"
          />
        </button>
      </div>

      {/* MESSENGER */}
      <div className="group relative flex items-center justify-end">
        <div className="absolute right-[115%] w-36 flex-col p-3 rounded-2xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-[#e3ddd6] opacity-0 invisible translate-x-4 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-300 ease-out z-50">
          {/* Arrow */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-[#e3ddd6] rotate-45"></div>

          <p className="text-[10px] font-bold text-[#866F56] tracking-[0.15em] text-center uppercase mb-2 border-b border-[#e3ddd6] pb-2 relative z-10">
            Fanpage
          </p>
          <div className="flex flex-col gap-1 relative z-10">
            {fbLinks.map((f) => (
              <a key={f.name} href={f.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-center py-2.5 text-[#3A3125] hover:bg-[#f9f6f2] hover:text-[#B38A58] rounded-xl transition-colors">
                {f.name}
              </a>
            ))}
          </div>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-full hover:scale-110 hover:-translate-x-1 transition-all duration-300 relative z-10">
          <img loading="lazy"
           src="/image/IconMessage.png"
            alt="Messenger"
            className="h-full w-full object-contain"
          />
        </button>
      </div>

      {/* SCROLL TO TOP */}
      <button
        onClick={scrollToTop}
        className="flex h-12 w-12 items-center justify-center rounded-full hover:scale-110 transition-transform duration-300"
      >
        <img loading="lazy"
         src="/image/FrameIcon.png"
          alt="Top"
          className="h-full w-full object-contain"
        />
      </button>
    </div>
  );
};
export default ContactSticky;
