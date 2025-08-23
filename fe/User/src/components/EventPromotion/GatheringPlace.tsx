type Props = {
  imageUrl?: string; // có thể truyền link ảnh khác
};



export default function GatheringPlace({
  imageUrl = "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-hotel-building-2-41217:Classic-Hor?wid=1300&fit=constrain",
}: Props) {
  return (
    <section className="mx-auto max-w-6xl gap-10 px-6 py-16 md:grid md:grid-cols-2 md:items-center">
      {/* Ảnh bên trái bo góc lớn */}
      <div className="overflow-hidden rounded-[28px] shadow-sm">
        <img
          src={imageUrl}
          alt="Sheraton Saigon exterior"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Nội dung bên phải */}
      <div className="mt-8 md:mt-0">
        <div className="text-[12px] tracking-[0.19em] text-gray-600">
          THE DISTINGUISHED HOST IN DOWNTOWN SAIGON
        </div>
        <h3 className="mt-3 font-serif text-4xl sm:text-5xl">
          The World’s Gathering Place
        </h3>
        <p className="mt-5 text-lg leading-8 text-gray-800">
          Impress your guests with a flawlessly executed event at Sheraton Saigon Grand Opera Hotel.
          Our 14 sophisticated meeting rooms in Saigon inspire productivity and leave a lasting
          impression. With over 2,200 sqm highlighted by the largest pillar-less ballroom venue (720 sqm),
          a ceiling height of 5.7 meters features three projector screens and main doors, our hotel could
          cater to all events of all sizes...{" "}
          <a href="#" className="underline">See More</a>
        </p>
      </div>
    </section>
  );
}
