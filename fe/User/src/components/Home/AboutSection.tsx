export default function AboutSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto py-16 px-6 gap-10">
      {/* Image */}
      <div className="md:w-1/2 w-full">
        <img
          src="/image/e74d18c929e587e37128814e5ba124a656faaae8 (1).jpg"
          alt="Hotel Room"
          width={600}
          height={400}
          className="rounded-xl shadow-lg object-cover w-full"
        />
      </div>

      {/* Text */}
      <div className="md:w-1/2 w-full text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2b3a67] mb-4">
          About Our Hotel
        </h2>

        <p className="text-gray-700 mb-3 leading-relaxed">
          <span className="text-2xl font-semibold text-[#2b3a67]">A</span> In Hotel,
          an oasis of sophistication in the heart of the city. From the moment you
          arrive, you are embraced by refined interiors, attentive service, and an
          atmosphere designed for absolute comfort.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Each suite is a masterpiece of modern design with breathtaking views, while
          our world-class dining, wellness spa, and exclusive amenities elevate every
          stay into a truly memorable experience.
        </p>

        <button className="border border-[#b38a58] text-[#3A3125] hover:bg-[#b38a58] hover:text-white transition px-6 py-2 rounded-md font-medium">
          Explore more
        </button>
      </div>
    </section>
  );
}
