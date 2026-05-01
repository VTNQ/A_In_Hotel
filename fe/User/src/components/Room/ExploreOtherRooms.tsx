import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRoom } from "../../service/api/Room";
import type { RoomResponse } from "../../type/room.types";
import { File_URL } from "../../setting/constant/app";

interface Props {
  roomGrid: RoomResponse[];
}

export default function ExploreOtherRooms({ roomGrid }: Props) {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      if (w < 640) setCardsPerView(1);
      else if (w < 1024) setCardsPerView(2);
      else if (w < 1280) setCardsPerView(3);
      else setCardsPerView(4);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchRooms = async () => {
      const res = await getRoom({
        all: true,
        filter: "status==3",
      });

      const allRooms: RoomResponse[] = res.data?.content || [];
      const excludeIds = roomGrid.map((r) => r.id);

      const filtered = allRooms.filter(
        (room) => !excludeIds.includes(room.id)
      );

      setRooms(filtered);
      setCurrentPage(0); // reset page khi data thay đổi
    };

    fetchRooms();
  }, [roomGrid]);

  /* ================= CHIA PAGE ================= */
  const pages: RoomResponse[][] = [];

  for (let i = 0; i < rooms.length; i += cardsPerView) {
    pages.push(rooms.slice(i, i + cardsPerView));
  }

  if (pages.length === 0) return null;

  const totalPages = pages.length;
  const safePage = Math.min(currentPage, totalPages - 1);

  return (
    <section className="bg-[#E9DCCB] py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT TEXT */}
          <div className="lg:w-60 shrink-0">
            <h3 className="text-3xl sm:text-4xl font-semibold text-[#7b5b3e] leading-tight">
              Explore <br className="hidden sm:block" />
              other <br className="hidden sm:block" />
              room options
            </h3>
          </div>

          {/* SLIDER */}
          <div className="relative flex-1 overflow-hidden">

            {/* TRACK */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${safePage * 100}%)`,
              }}
            >
              {pages.map((group, pageIndex) => (
                <div
                  key={pageIndex}
                  className="min-w-full flex gap-4"
                >
                  {group.map((room) => (
                    <div key={room.id} className="flex-1">

                      <div className="relative h-[360px] sm:h-[420px] rounded-xl overflow-hidden shadow-md group">

                        <img
                          src={File_URL + room.images[0]?.url}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F3F0] via-transparent to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h4 className="text-sm font-semibold uppercase text-[#6b4e2e]">
                            {room.roomName}
                          </h4>

                          <p className="text-xs text-gray-600 mb-3">
                            {room.hotelName}
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-green-600 hover:underline cursor-pointer">
                              View room details
                            </span>

                            <button className="bg-[#b38a58] hover:bg-[#9c7a55] text-white text-xs px-4 py-1.5 rounded transition">
                              Booking
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* LEFT BUTTON */}
            {safePage > 0 && (
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* RIGHT BUTTON */}
            {safePage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* DOTS */}
            <div className="flex justify-center gap-2 mt-8">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition
                    ${i === safePage ? "bg-[#7b5b3e]" : "bg-[#cbb9a3]"}`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}