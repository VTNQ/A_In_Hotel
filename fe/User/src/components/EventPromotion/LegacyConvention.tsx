// src/components/EventPromotion/LegacyConvention.tsx

type Props = {
  imageUrl?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  seeMoreHref?: string;
};

/** Section 1: Legacy Convention Service */
export default function LegacyConvention({
  imageUrl = "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-meeting-8588-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1300px:*",
  eyebrow = "THE ENERGY OF SAIGON’S HOSPITALITY",
  title = "Legacy Convention Service",
  description = `An experienced team of dedicated professionals, our convention team specializes in the meticulous execution of every detail that will take your event to the next level. With over two decades of experience and commitment to perfection, our reputation for world-class service and innovative catering sets the standard for excellence. From initial planning to banquet brilliance and final execution, we foster...`,
  seeMoreHref = "#",
}: Props) {
  return (
    <section className="mx-auto max-w-6xl gap-10 px-6 py-16 md:grid md:grid-cols-2 md:items-center">
      {/* Text bên trái */}
      <div>
        <div className="text-[12px] tracking-[0.18em] text-gray-600">
          {eyebrow}
        </div>
        <h3 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h3>
        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-800">
          {description}{" "}
          <a href={seeMoreHref} className="underline">
            See More
          </a>
        </p>
      </div>

      {/* Ảnh bên phải */}
      <div className="mt-8 overflow-hidden rounded-[28px] shadow-sm md:mt-0">
        <img
          src={imageUrl}
          alt="Convention service venue"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
}

/** Section 2: Legacy Ballroom (chỉ ảnh full width) */
export function LegacyBallroom({
  imageUrl = "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-ballroom-22245:Wide-Hor?wid=2880&fit=constrain",
}: Props) {
  return (
    <section className="w-full">
      <img
        src={imageUrl}
        alt="Ballroom full view"
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </section>
  );
}


/** Section 3: Meetings and Events */
export function MeetingsAndEvents() {
  return (
    <section className="bg-gray-50 py-16 text-center">
      <h2 className="font-serif text-3xl sm:text-4xl font-bold">
        Meetings and Events
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-gray-700">
        Find success in our versatile meeting venue in Saigon located on Dong Khoi Street, Ho Chi Minh City
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">
        <div className="border-l-2 border-purple-400 pl-4 text-gray-800">
          Inspire your guests in our pillar-less ballroom, one of the largest meeting rooms in Saigon
        </div>
        <div className="border-l-2 border-purple-400 pl-4 text-gray-800">
          Choose from our 14 meeting rooms in Saigon for corporate functions in the heart of the city
        </div>
        <div className="border-l-2 border-purple-400 pl-4 text-gray-800">
          Host a networking event at our business hotel and select from 2,500 square meters of event space
        </div>
      </div>

      <a
        href="#"
        className="mt-10 inline-block text-black underline font-medium"
      >
        See More
      </a>
    </section>
  );
}
