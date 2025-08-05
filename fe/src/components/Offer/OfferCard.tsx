// components/Offer/OfferCard.tsx
interface OfferCardProps {
  image: string;
  title: string;
  date: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ image, title, date }) => {
  return (
    <div className="keen-slider__slide w-[300px] shrink-0 rounded-lg overflow-hidden relative">
      <img src={image} alt={title} className="w-full h-[220px] object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <p className="text-xs mb-1">{date}</p>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
    </div>
  );
};

export default OfferCard;
