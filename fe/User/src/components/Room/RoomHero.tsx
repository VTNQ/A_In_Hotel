const RoomHero = () => {
  return (
    <section
      className="
        relative
        w-full
        h-[280px]
        sm:h-[380px]
        md:h-[480px]
        lg:h-[570px]
        flex items-center justify-center
        bg-cover bg-center
        "
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1505691938895-1758d7feb511)",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-wide">
            Room & Suites
        </h1>
      </div>
    </section>
  );
};
export default RoomHero;
