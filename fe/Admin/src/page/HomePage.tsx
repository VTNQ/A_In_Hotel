import SideBar from "../components/SideBar/SideBar"
import TopBar from "../components/TopBar";

const HomePage=()=>{
    return(
       <div className="flex h-screen bg-gray-50">
        <SideBar/>
        <div className="flex flex-col flex-1">
            <TopBar/>
            <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-gray-700">
            Welcome to Dashboard
          </h1>
        </main>
        </div>
       </div>
    )
}
export default HomePage;