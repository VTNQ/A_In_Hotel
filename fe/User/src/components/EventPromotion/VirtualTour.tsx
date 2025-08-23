import { Box } from "lucide-react"; 

type Props = {
  backgroundUrl?: string;
};

export default function VirtualTour({
  backgroundUrl = "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-event-service-35661:Wide-Hor?wid=1920&fit=constrain",
}: Props) {
  return (
    <section className="relative">
      {/* Background image */}
      <div className="h-[500px] w-full">
        <img
          src={backgroundUrl}
          alt="Event service"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Centered card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mx-4 max-w-lg rounded-md bg-white p-8 text-center shadow-lg">
          <Box className="mx-auto h-8 w-8 text-gray-700" /> {/* icon thay cho Cube */}
          <h3 className="mt-4 font-serif text-2xl">
            Take A 360° Virtual Tour
          </h3>
          <p className="mt-4 text-gray-700 leading-7 text-sm sm:text-base">
            Step into the extraordinary with our comprehensive virtual tour of our exceptional
            event facilities. Picture your next successful gathering in our expansive, pillar-less
            Grand Ballroom, or in our flexible meeting rooms and executive boardrooms. Each space
            is designed for versatility and sophistication, ensuring an unforgettable experience
            for your guests. Let our stunning venues set the stage for your next event in the heart
            of Saigon.
          </p>
          <button className="mt-6 rounded-full bg-[#6e5f5b] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
            Begin Your Virtual Event Tour
          </button>
        </div>
      </div>
    </section>
  );
}
