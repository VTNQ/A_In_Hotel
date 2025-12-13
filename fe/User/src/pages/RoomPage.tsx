import Navbar from "../components/Navbar";
import FilterBar from "../components/Room/FilterBar";
import HotelTabs from "../components/Room/HotelTabs";
import Pagination from "../components/Room/Pagination";
import RoomGrid from "../components/Room/RoomGrid";
import RoomHero from "../components/Room/RoomHero";


const RoomPage = () => {
    return (
        <>
            <Navbar />
            <div className="bg-[#FBF7F2] min-h-screen">
                <RoomHero />
                <HotelTabs />

                <div className="max-w-7xl mx-auto px-6 py-10">
                    <FilterBar />
                    <RoomGrid />
                    <Pagination />
                </div>
            </div>
        </>
    );
}
export default RoomPage;