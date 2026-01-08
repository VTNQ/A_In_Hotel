import GalleryImageGrid from "../components/Gallery/GalleryImageGrid";
import RoomHero from "../components/Room/RoomHero"

const GalleryPage = ()=>{
    return(
        <>
        <div className="bg-[#FBF7F2] min-h-screen">
            <RoomHero/>
            <GalleryImageGrid/>
        </div>
        </>
    )
}
export default GalleryPage;