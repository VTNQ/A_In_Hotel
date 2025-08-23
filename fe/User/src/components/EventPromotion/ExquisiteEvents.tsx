// src/components/EventPromotion/ExquisiteEvents.tsx

type EventCard = {
  title: string;
  img: string;
  desc: string;
};

type Props = {
  eyebrow?: string;
  items?: EventCard[];
  seeMoreHref?: string;
};

export default function ExquisiteEvents({
  eyebrow = "EXQUISITE EVENTS",
  seeMoreHref = "#",
  items = [
    {
      title: "Large Corporate Event",
      img: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-ballroom-30224:Square?wid=1200&fit=constrain",
      desc:
        "Featuring 240 sqm grand space with the capacity to host up to 300 guests for theatre style & 200 for cocktail style, our ballrooms are ideal for large scale functions — either conferences, summits, press launches, ceremonies or gala dinners. Enjoy impressive floor-to-ceiling windows at the pre-function area filled with an abundance of natural light, along with the flexibility to incorporate a stage & dance floor.",
    },
    {
      title: "Medium meetings",
      img: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-ballroom-22245:Wide-Hor?wid=2880&fit=constrain",
      desc:
        "Our fully‑equipped function rooms located on level 2 and level 3 are flexible and ideal for medium events. With options of breakout rooms, our venues provide flexibilities for educational seminars, panel discussions, product demonstrations, networking or recruitment events accommodating up to 100 guests.",
    },
    {
      title: "Small Gatherings",
      img: "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-meeting-8588-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1300px:*",
      desc:
        "Our dedicated executive boardroom is ideal for upscale and intimate board meetings, focus groups or brainstorming sessions up to 15 guests. Complemented by natural daylight, this inviting space is built for productive meetings.",
    },
  ],
}: Props) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-6">
        {/* Eyebrow */}
        <div className="mb-6 text-center text-[12px] tracking-[0.22em] text-gray-600">
          {eyebrow}
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((i) => (
            <article
              key={i.title}
              className="
                flex h-full flex-col overflow-hidden rounded-[22px]
                bg-gray-50 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md
              "
            >
              {/* Ảnh: ép cùng tỷ lệ để đều nhau */}
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={i.img}
                  alt={i.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Nội dung */}
              <div className="flex flex-col p-8">
                <h3 className="font-serif text-3xl leading-tight min-h-[48px]">
                  {i.title}
                </h3>
                <div className="mt-4 h-1 w-24 rounded bg-purple-400/80" />
                <p className="mt-5 text-gray-800 leading-7">
                  {i.desc}
                </p>

                {/* đẩy phần chân xuống đáy */}
                <div className="mt-auto" />
              </div>

              {/* Accent viền tím dưới */}
              <div className="mx-6 mb-6 h-2 rounded-b-[14px] bg-purple-400/70" />
            </article>
          ))}
        </div>

        {/* See more */}
        <div className="mt-10 text-center">
          <a href={seeMoreHref} className="underline">
            See More
          </a>
        </div>
      </div>
    </section>
  );
}
