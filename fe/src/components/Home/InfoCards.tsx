import React from "react";

const cards = [
  {
    title: "Meet You in the Lobby",
    description:
      "Spend time in the Sheraton lobby. We’ve created spaces to connect in unique and innovative ways.",
    image:
      "https://cache.marriott.com/is/image/marriotts7prod/si-yyzgs-lobby-reception--10266:Square?wid=1200&fit=constrain", // Thay bằng URL hình thật
    button: {
      label: "Learn More",
      link: "#",
    },
  },
  {
    title: "Welcoming Service",
    description:
      "With over 85 years of welcoming hospitality, our associates will make you want to come back again.",
    image:
      "https://cache.marriott.com/is/image/marriotts7prod/si-restaurant-reception-15862:Square?wid=1200&fit=constrain",
    button: {
      label: "Learn More",
      link: "#",
    },
  },
  {
    title: "Global Destinations",
    description:
      "Look for Sheraton Hotels in the heart of cities all over the world.",
    image:
      "https://cache.marriott.com/content/dam/marriott-renditions/WAWSI/wawsi-city-view-0059-sq.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
    button: {
      label: "Find a Hotel",
      link: "#",
    },
  },
];

const InfoCards: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white text-black">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="uppercase text-sm tracking-widest text-gray-500">
          Where the world comes together
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded overflow-hidden shadow-sm transition hover:shadow-md"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-left">
              <h3 className="text-xl font-serif font-medium mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-700 mb-4">{card.description}</p>
              <a
                href={card.button.link}
                className="inline-block border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition"
              >
                {card.button.label}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoCards;
