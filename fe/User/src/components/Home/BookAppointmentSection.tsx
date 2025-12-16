

const BookAppointmentSection = () => {
    return (
        <section className="w-full bg-[#9c8266] py-16">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 px-6">

                {/* LEFT IMAGE */}
                <div className="w-full">
                    <img
                        src="/image/9d73a69d98ce7e6a1df54437f26aa08426192c09.jpg" // đổi path theo project
                        alt="Luxury Room"
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>

                {/* RIGHT FORM */}
                <div className="text-white flex flex-col justify-center">
                    <span className="uppercase text-sm tracking-widest mb-2">
                        Book appointment
                    </span>

                    <h2 className="text-4xl font-serif leading-tight mb-4">
                        Relaxation and luxury <br /> during your stay
                    </h2>

                    <p className="text-sm text-white/80 mb-8 max-w-md">
                        Because a place can change everything, especially the moment you
                        span there. Make an appointment with what's essential.
                    </p>

                    <form className="space-y-6">
                        {/* Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                placeholder="Name"
                                className="bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70"
                            />
                            <input
                                type="text"
                                placeholder="Last name"
                                className="bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70"
                            />
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70"
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                className="bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70"
                            />
                        </div>

                        {/* Message */}
                        <textarea
                            placeholder="Message"
                            rows={3}
                            className="w-full bg-transparent border-b border-white/50 focus:outline-none py-2 text-white placeholder-white/70 resize-none"
                        />

                        {/* Checkbox */}
                        <label className="flex items-center gap-3 text-sm text-white/80 cursor-pointer">
                            <input
                                type="checkbox"
                                className="peer hidden"
                            />

                            {/* Custom box */}
                            <span
                                className="
      w-5 h-5
      rounded-md
      border border-white/70
      flex items-center justify-center
      transition
      peer-checked:bg-white
      peer-checked:border-white
    "
                            >
                                {/* Check icon */}
                                <svg
                                    className="w-3 h-3 text-[#8c7356] opacity-0 peer-checked:opacity-100"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>

                            <span>I agree with the site's privacy policy</span>
                        </label>


                        {/* Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full rounded-md bg-[#bfa383] py-3 text-center text-sm font-medium text-white hover:bg-[#c9ad8c] transition"
                        >
                            Get in touch
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BookAppointmentSection;
