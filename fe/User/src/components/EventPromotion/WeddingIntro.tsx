type Props = {
  title?: string;
  description?: React.ReactNode;
  className?: string;
};

export default function WeddingIntro({
  title = "Dream Weddings in Saigon",
  description = (
    <>
      Start your life-long love story and create memories with a wedding celebration at Sheraton
      Saigon Grand Opera Hotel, from your engagement party to your ceremony and reception, we pride
      ourselves as one of the most iconic wedding destinations in Saigon with over 20 years of
      experiences. Satisfy every taste bud with an array of Asian and Western gastronomy curated by
      our team of seasoned chefs complimented...{" "}
      <a href="#" className="underline">See More</a>
    </>
  ),
  className = "",
}: Props) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-gray-800">
          {description}
        </p>
      </div>
    </section>
  );
}
