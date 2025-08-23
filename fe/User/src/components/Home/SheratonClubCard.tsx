const SheratonClubCard = () => {
    return (
        <div className="flex flex-col lg:flex-row justify-center items-center bg-gray-100 py-12 px-4">
            <div className="relative max-w-3xl w-full rounded-lg overflow-hidden shadow-lg">
                <img
                    src="https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-sheraton-clublounge-4662-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*"
                    alt="Sheraton Club"
                    className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                    Exclusive Access
                </span>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-8 mt-6 lg:mt-0 lg:ml-10 max-w-md w-full">
                <p className="uppercase text-sm tracking-widest text-gray-500 mb-1">Club</p>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sheraton Club</h2>
                <p className="text-sm text-gray-700 mb-6">
                    A private haven of unprecedented luxury where seasoned guests enjoy elevated privileges and personalized services to enrich their stay.
                </p>
                <div className="flex items-start border border-gray-300 rounded-lg p-4 mb-6">
                    <img
                        src="/as"
                        alt="Marriott Bonvoy"
                        className="w-24 h-auto mr-4"
                    />
                    <p className="text-xs text-gray-600">
                        Complimentary for:<br />
                        Platinum, Titanium, and Ambassador Elite Members<br />
                        (Plus One Guest)
                    </p>
                </div>
                <div className="flex flex-col space-y-3">
                    <button className="bg-gray-600 text-white font-medium py-3 px-6 rounded-full hover:bg-gray-700 transition">
                        Browse Rooms
                    </button>
                    <button className="border border-gray-400 text-gray-800 font-medium py-3 px-6 rounded-full hover:bg-gray-100 transition">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    )
}
export default SheratonClubCard;