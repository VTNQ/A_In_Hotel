import { motion } from "framer-motion";

const Hero360VirtualTour = () => {
    return (
        <div
            className="relative w-full h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-hotel-lobby-34714:Wide-Hor?wid=1920&fit=constrain')`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Animated Card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center px-4"
            >
                <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-lg w-full text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    >
                        <div className="text-3xl mb-2">🧭</div>
                    </motion.div>

                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                        Take A 360° Virtual Tour
                    </h2>

                    <p className="text-gray-600 text-sm md:text-base mb-6">
                        Explore Sheraton Saigon Grand Opera Hotel and experience full 360° and 3D views. Navigate through our lobby, guest rooms, restaurants & bars, and more.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800 text-white px-6 py-2 rounded-full font-medium shadow-md"
                    >
                        Begin Your Virtual Journey
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Hero360VirtualTour;
