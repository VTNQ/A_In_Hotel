// src/components/EventPromotion/ExquisiteEvents.tsx
// (WeddingTriadSection – 3 block liên tiếp, block giữa đảo vị trí)

type Block = {
  eyebrow?: string;
  title: string;
  body: string;
  img: string;
  imgAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** true => Ảnh trái / Chữ phải; false => Chữ trái / Ảnh phải */
  reverse?: boolean;
};

type Props = {
  className?: string;
  blocks?: Block[];
};

export default function WeddingTriadSection({
  className = "",
  blocks = [
    // #1 — Ảnh trái / Chữ phải
    {
      eyebrow: "PLAN YOUR DAY",
      title: "Professional Wedding Specialist",
      body:
        "From passion to perfection, our bespoke wedding planning service provided by our professional wedding specialist makes your wedding flawlessly and free-hassles. Experience the art of wedding event as we dedicate ourselves to guarantee your happiness and beyond, from the initial consultations to the final moments of your celebration, leaving you with cherished memories throughout your wedding...",
      ctaLabel: "See More",
      ctaHref: "#",
      img: "https://cache.marriott.com/is/image/marriotts7prod/sgnsi-grand-ballroom-wedding-0894:Classic-Hor?wid=1300&fit=constrain",
      imgAlt: "Wedding table setting",
      reverse: true,
    },
    // #2 — (ĐẢO) Chữ trái / Ảnh phải
    {
      eyebrow: "IMPRESS YOUR GUESTS",
      title: "Unparalleled Culinary Excellence",
      body:
        "Treat your families and friends with a sumptuous wedding feast. Led by our team of culinarians with decades of experiences, our banquet culinary team offers a wide range of exquisite menus and meticulously-crafted options spanning from Asian, Cantonese and Western cuisines to delight all taste buds. Rest assured that your guests will share great culinary highlights with you on your special day.",
      img: "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-grand-ballroom-wedding-0893-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1300px:*",
      imgAlt: "Grand Ballroom wedding feast",
      reverse: false,
    },
    // #3 — Ảnh trái / Chữ phải + nút
    {
      eyebrow: "THE ONE-OF-A-KIND VENUE",
      title: "Exceptional Boutique Wedding",
      body:
        "Spark your wedding imagination with Sheraton Saigon Grand Opera Hotel’s highest floor. Situated above level 23, Night Spot brags a blissful sanctuary with magnificent 360-degree views boasting its own dedicated foyer for your own celebration and a one and only backdrop featuring Saigon River and the surrounding city scapes. This wedding space is perfect for intimate celebration up to 150 guests.",
      ctaLabel: "Learn More",
      ctaHref: "#",
      img: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-level-23-nightspot-24765:Classic-Hor?wid=2880&fit=constrain",
      imgAlt: "Level 23 Night Spot",
      reverse: true,
    },
  ],
}: Props) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto max-w-6xl space-y-16 px-6">
        {blocks.map((b, idx) => (
          <div key={idx} className="grid items-center gap-10 md:grid-cols-12">
            {/* Ảnh */}
            <div
              className={`${
                b.reverse ? "md:order-1 md:col-span-7" : "md:order-2 md:col-span-7"
              }`}
            >
              <div className="overflow-hidden rounded-[22px]">
                <img
                  src={b.img}
                  alt={b.imgAlt ?? b.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Chữ */}
            <div
              className={`${
                b.reverse ? "md:order-2 md:col-span-5" : "md:order-1 md:col-span-5"
              }`}
            >
              {b.eyebrow && (
                <div className="text-[12px] tracking-[0.20em] text-gray-500">
                  {b.eyebrow}
                </div>
              )}
              <h3 className="mt-3 font-serif text-4xl sm:text-5xl">{b.title}</h3>
              <p className="mt-5 text-[17px] leading-8 text-gray-800">{b.body}</p>

              {b.ctaLabel &&
                (b.ctaLabel.toLowerCase().includes("see more") ? (
                  <a href={b.ctaHref ?? "#"} className="mt-3 inline-block underline">
                    {b.ctaLabel}
                  </a>
                ) : (
                  <a
                    href={b.ctaHref ?? "#"}
                    className="mt-7 inline-block rounded-full bg-[#6e5f5b] px-6 py-3 font-medium text-white hover:opacity-90"
                  >
                    {b.ctaLabel}
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
