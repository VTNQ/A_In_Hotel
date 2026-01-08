const images = Array.from({ length: 11 }).map((_, i) => `https://picsum.photos/800/600?random=${i + 1}`)
const GalleryImageGrid = () => {
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-3 gap-4 auto-rows-[180px]">
                <div className="col-span-3 row-span-2 overflow-hidden rounded-2xl">
                    <img
                        src={images[0]}
                        alt="Hotel"
                        className="h-full w-full object-cover"
                    />
                </div>
                {images.slice(1, 5).map((src, idx) => (
                    <div
                        key={idx}
                        className="col-span-1 row-span-1 overflow-hidden rounded-2xl"
                    >
                        <img src={src} alt="hotel" className="h-full w-full object-cover" />
                    </div>
                ))}
                <div className="col-span-1 row-span-2 overflow-hidden rounded-2xl">
                    <img
                        src={images[5]}
                        alt="hotel"
                        className="h-full w-full object-cover"
                    />
                </div>
                {images.slice(6).map((src, idx) => (
                    <div
                        key={idx}
                        className="col-span-1 row-span-1 overflow-hidden rounded-2xl"
                    >
                        <img src={src} alt="hotel" className="h-full w-full object-cover" />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default GalleryImageGrid;