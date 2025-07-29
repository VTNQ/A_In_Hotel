const Layout=()=>{
    return(
        <div className="w-full bg-white p-4 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Sheraton Saigon Grand Opera Hotel</h1>
                    <div className="flex items-center space-x-1 mt-1">
                        {[...Array(4)].map((_,i)=>(
                            <div key={i} className="w-3 h-3 bg-purple-600 rounded-full"/>
                        ))}
                        <div className="w-3 h-3 border-2 border-purple-600 rounded-full"/>
                        <span className="ml-2 text-gray-600 text-sm">4.4 • <a href="#" className="underline">1087 Reviews</a></span>
                    </div>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <a href="#" className="flex items-center text-purple-700 hover">
                        
                    </a>
                </div>
            </div>
        </div>
    )
}