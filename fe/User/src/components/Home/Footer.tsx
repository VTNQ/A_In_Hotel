"use client";

export default function Footer() {
  return (
    <footer className="bg-[#f9f6f2] text-[#3A3125] border-t border-[#707070]">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">

          {/* LOGO */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* Logo placeholder */}
              <img
                src="/image/logo.png"
                alt="A In Hotel Logo"
                width={250}
                height={250}
                className="object-contain"

              />
            </div>
          </div>

          
          <div className="md:col-span-2">
            <p className="font-semibold tracking-widest mb-3 text-sm text-[#866F56]">
              DESTINATION
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#2B2B2B]">

              {/* LEFT */}
              <div className="space-y-1">
                <p className="font-semibold ">A IN HOTEL GLAMOUR</p>
                <p>
                  63/1–63/3 Đường số 19, Phường An Khánh, TP. Thủ Đức
                </p>
                <p>028 6281 3678 · 0822 414 383</p>

                <p className="mt-3 font-medium">A IN HOTEL DEL LUNA</p>
                <p>
                  126 Đề Thám, Phường Cầu Ông Lãnh, TP. HCM
                </p>
                <p>028 3920 8689 · 0333 912 721</p>
              </div>

              {/* RIGHT */}
              <div className="space-y-1">
                <p className="font-medium">A IN HOTEL ATISTAR</p>
                <p>
                  30 Đường số 14, Phường An Nhơn, TP. HCM
                </p>
                <p>093 464 05 85</p>

                <p className="mt-3 font-medium">A IN HOTEL RIVERSIDE</p>
                <p>
                  188–189 Bến Vân Đồn, Phường Khánh Hội, TP. HCM
                </p>
                <p>028 3826 8090</p>
              </div>

            </div>
          </div>

          {/* CONTACT */}
          <div>
            <p className="font-semibold tracking-widest mb-3 text-sm text-[#866F56]">
              CONTACT
            </p>
            <div className="flex items-center gap-4 text-[#6b5f4f]">
              <span className="w-8 h-8 border rounded-full flex items-center justify-center">
                fb
              </span>
              <span className="w-8 h-8 border rounded-full flex items-center justify-center">
                ig
              </span>
              <span className="w-8 h-8 border rounded-full flex items-center justify-center">
                in
              </span>
            </div>
          </div>
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full 
                 border border-dashed border-[#c8b9a6]
                 flex items-center justify-center
                 bg-[#f9f6f2]"
            >
            <img
                src="/image/ArrowUp.png"
                alt="A In Hotel Logo"
                width={250}
                height={250}
                className="object-contain"

              />
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="bg-[#3A3125] text-white text-center py-3 text-xs tracking-wide">
        © 2025 A In Hotel
      </div>
    </footer>
  );
}
