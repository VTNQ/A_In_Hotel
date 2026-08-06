import { useTranslation } from "react-i18next";

const BookAppointmentSection = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-[#9c8266] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 px-4 sm:px-6 lg:px-8 items-center">
        {/* LEFT IMAGE */}
        <div className="w-full">
          <img loading="lazy"
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"
            alt="Luxury Room"
            className="
              w-full 
              h-[280px] 
              sm:h-[380px] 
              lg:h-full
              object-cover 
              rounded-2xl
              shadow-lg
            "
          />
        </div>

        {/* RIGHT FORM */}
        <div className="text-white flex flex-col justify-center">
          <span className="uppercase text-xs tracking-[0.3em] mb-3 block text-white/80">
            {t("home.bookAppointment.subtitle")}
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display leading-tight mb-4">
            {t("home.bookAppointment.titleLine1")}
            <br className="hidden sm:block" />
            {t("home.bookAppointment.titleLine2")}
          </h2>

          <p className="text-sm sm:text-base text-white/80 mb-8 max-w-md">
            {t("home.bookAppointment.description")}
          </p>

          <form className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder={t("home.bookAppointment.name")}
                className="bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70 transition"
              />
              <input
                type="text"
                placeholder={t("home.bookAppointment.lastName")}
                className="bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70 transition"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="email"
                placeholder={t("home.bookAppointment.email")}
                className="bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70 transition"
              />
              <input
                type="text"
                placeholder={t("home.bookAppointment.phone")}
                className="bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70 transition"
              />
            </div>

            {/* Message */}
            <textarea
              placeholder={t("home.bookAppointment.message")}
              rows={3}
              className="w-full bg-transparent border-b border-white/50 focus:border-white focus:outline-none py-2 text-white placeholder-white/70 resize-none transition"
            />

            {/* Checkbox */}
            <label className="flex items-center gap-3 text-sm text-white/80 cursor-pointer">
              <input type="checkbox" className="peer sr-only" />

              <div
                className="w-5 h-5
                rounded-md border border-white/70
                flex items-center justify-center
                transition-all duration-200
                peer-checked:bg-white
                peer-checked:border-white"
              >
                <svg
                  className="w-3 h-3
                  text-[#9c8266]
                  transition-all duration-200
                  peer-checked:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <span>{t("home.bookAppointment.privacyPolicy")}</span>
            </label>
            {/* Button */}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-[#bfa383] py-3 text-center text-sm font-medium text-white hover:bg-[#c9ad8c] transition"
            >
              {t("home.bookAppointment.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookAppointmentSection;
