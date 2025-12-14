import Navbar from "../components/Navbar";
import Pagination from "../components/Room/Pagination";
import RoomGrid from "../components/Room/RoomGrid";
import RoomHero from "../components/Room/RoomHero";
import RoomFilterSideBar from "../components/Room/RoomFilterSidebar";


const RoomPage = () => {
   
    return (
        <>
            <Navbar />
            <div className="bg-[#FBF7F2] min-h-screen">
                <RoomHero />

                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT FILTER */}
                        <div className="lg:col-span-4">
                            <RoomFilterSideBar />
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="lg:col-span-8">

                            <RoomGrid />
                            <Pagination />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
export default RoomPage;