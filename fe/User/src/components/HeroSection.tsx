
const HeroSection = () => {
  return (
   <section
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/image/35f6660240b73115e02c8ff7f3435646d2446209.jpg')" }} // 👉 thay ảnh hero ở đây
    >
      <div className="absolute inset-0 bg-black/40"></div> {/* overlay tối nhẹ */}
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to A-IN HOTEL</h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Trải nghiệm không gian sang trọng và đẳng cấp với dịch vụ hoàn hảo.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
