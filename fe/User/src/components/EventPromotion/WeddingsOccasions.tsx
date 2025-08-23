import { useState } from "react";

type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 transform transition-transform duration-200 ${
        open ? "rotate-180" : "rotate-0"
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SimpleAccordion({ items }: { items: AccordionItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map((it, idx) => {
        const open = openIdx === idx;
        return (
          <div key={it.title}>
            <button
              onClick={() => setOpenIdx(open ? null : idx)}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="text-lg">{it.title}</span>
              <Chevron open={open} />
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                open ? "max-h-[600px] pb-6" : "max-h-0"
              }`}
            >
              <div className="text-gray-700 leading-7">{it.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WeddingsOccasions() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading + subheading */}
        <h2 className="text-center font-serif text-4xl sm:text-5xl">
          Weddings and Occasions
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-gray-700">
          Celebrate your love story in Ho Chi Minh City, thanks to our elegant
          venues and wedding packages
        </p>

        {/* Accordion: Additional Wedding Services */}
        <div className="mt-10">
          <SimpleAccordion
            items={[
              {
                title: "Additional Wedding Services",
                content: (
                  <ul className="list-disc pl-6">
                    <li>Floral decoration, lighting &amp; AV support</li>
                    <li>Dedicated wedding specialist</li>
                    <li>Live music / MC arrangements</li>
                    <li>Custom signage &amp; photo backdrop</li>
                  </ul>
                ),
              },
            ]}
          />
        </div>

        {/* Three bullets with purple vertical rules */}
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div className="border-l-2 border-purple-400 pl-5 text-gray-900">
            Host a wedding in our largest event space, accommodating up to
            1,000 guests in Ho Chi Minh
          </div>
          <div className="border-l-2 border-purple-400 pl-5 text-gray-900">
            Let our experienced, on‑site planners handle all the little details
            of your wedding venue
          </div>
          <div className="border-l-2 border-purple-400 pl-5 text-gray-900">
            Choose from a selection of catering menus or customize a wedding
            package to suit your needs
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="#" className="underline">
            See More
          </a>
        </div>

        {/* Second accordion group */}
        <div className="mt-12">
          <SimpleAccordion
            items={[
              {
                title: "Floor Plans",
                content:
                  "Download detailed floor plans for our ballrooms and meeting rooms to help you map out your big day.",
              },
              {
                title: "Capacity Chart",
                content:
                  "View maximum capacities by layout (banquet, classroom, theatre, cocktail) for each space.",
              },
              {
                title: "Room Set-up Examples",
                content:
                  "Explore inspiration and sample set‑ups for ceremonies, receptions and after‑parties.",
              },
              {
                title: "Equipment and Services",
                content:
                  "Lighting, sound, stage, dance floor, live streaming, valet parking and more can be arranged on request.",
              },
            ]}
          />
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h3 className="mb-4 font-serif text-3xl">
            Frequently Asked Questions
          </h3>
          <SimpleAccordion
            items={[
              {
                title:
                  "How many event rooms does Sheraton Saigon Grand Opera Hotel have?",
                content:
                  "We offer 14 meeting and event spaces, including the pillar‑less Grand Ballroom and multiple breakout rooms.",
              },
              {
                title:
                  "What is the largest capacity event room at Sheraton Saigon Grand Opera Hotel?",
                content:
                  "Our Grand Ballroom can host up to 1,000 guests for a standing reception or 650 guests for theatre‑style seating.",
              },
              {
                title:
                  "Does Sheraton Saigon Grand Opera Hotel provide wedding services?",
                content:
                  "Yes. From planning and styling to catering and technical support, our dedicated wedding team is at your service.",
              },
              {
                title:
                  "How do I book a meeting or event at Sheraton Saigon Grand Opera Hotel?",
                content:
                  "Share your event details with us via our enquiry form or contact our sales team. We’ll respond with availability and proposals.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
