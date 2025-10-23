import SceneElement from './SceneElement';
import windows from '/window.png';
import Vector from '/Vector.png';
import lamp from "/lamp.png";
import Rectangle4 from '/Rectangle 4.png';
import Rectangle12 from '/Rectangle 12.png';
import Reactangle2 from '/Rectangle 2.png';
import Clock1 from '/clock1.png';
import Clock2 from '/clock 2.png';
import ReceptionShip from '/1a46aa598690785bb202f63fc70d55efce7f65d2.png';
import Clock3 from '/clock 3.png';
import ReceptionistBoard from '/ReceptionistBoard.png';
import Intersect from '/Intersect.png';
import lampMobile from '/lampMobile.png';
import Vali from '/vali.png';
import Star1 from '/Star 1.png';
import Clock4 from '/clock4.png';
import lampMobileLeft from '/lampMobileLeft.png';
import ReactangleMobile from '/RectangleMobile.png';
const BackgroundLayer = () => {
    return (
        <div className='absolute inset-0 overflow-hidden'>
            <SceneElement
                src={windows}
                alt="Window Left"
                className="absolute top-[22%] left-[6%]  opacity-95 hidden md:block"
            />

            <SceneElement
                src={windows}
                alt="Window Right"
                className="absolute top-[22%] left-[15%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Intersect}
                alt='Intersect'
                className="absolute top-[68%] left-0 w-[100%] h-[6%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Intersect}
                alt='Intersect'
                className="absolute top-[76%] left-0 w-[100%] h-[4%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Intersect}
                alt='Intersect'
                className="absolute top-[82%] left-0 w-[100%] h-[3%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Intersect}
                alt='Intersect'
                className="absolute top-[86%] left-0 w-[100%] h-[3%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Intersect}
                alt='Intersect'
                className="absolute top-[90%] left-0 w-[100%] h-[10%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Vali}
                alt='Vali'
                className="absolute top-[45%] left-[9%]   opacity-95 hidden md:block"
            />
            <SceneElement
                src={Rectangle4}
                alt="Reactangle4"
                className="absolute top-[8%] left-0 w-[25%] h-[4%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Rectangle4}
                alt="Reactangle4"
                className="absolute top-[15%] left-0 w-[25%] h-[4%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Rectangle12}
                alt="Reactangle4"
                className="absolute top-[9%] left-[25%] w-[28%] h-[4%] opacity-95 hidden md:block"
            />
            <SceneElement
                src={Rectangle12}
                alt="Reactangle4"
                className="absolute top-[16%] left-[25%] w-[28%] h-[4%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={Reactangle2}
                alt="Reactangle2"
                className="absolute top-[23%] left-[25%] w-[28%] h-[20%]  opacity-95 hidden md:block"
            />
            <SceneElement
                src={ReactangleMobile}
                alt='Reactangle Mobile'
                className='sm:block md:hidden top-[16%] w-full h-[3%]'
                />
            <SceneElement
                src={ReactangleMobile}
                alt='Reactangle Mobile'
                className='sm:block md:hidden top-[20%] w-full h-[3%]'
                />
            <SceneElement
                src={Clock1}
                alt='clock 1'
                className='absolute top-[28%] left-[27%]  opacity-95 hidden md:block'
            />
            <SceneElement
                src={Clock2}
                alt='clock 2'
                className='absolute top-[28%] left-[33%]  opacity-95 hidden md:block'
            />
            <SceneElement
                src={Clock3}
                alt='clock 3'
                className='absolute top-[28%] left-[40%]  opacity-95 hidden md:block'
            />
            <SceneElement
                src={Clock4}
                alt='clock 4'
                className='absolute top-[28%] left-[47%]  opacity-95 hidden md:block'
            />
            <SceneElement
                src={ReceptionShip}
                alt="Reception Ship"
                className='absolute top-[60%] left-[28%] w-[25%]  opacity-95 hidden md:block'
            />
            <SceneElement
                src={ReceptionistBoard}
                alt="Receptionist Board"
                className='absolute top-[55%] left-[35%] w-[6%]  opacity-95 hidden md:block'
            />
            <SceneElement
                src={Vector}
                alt="vector"

                className="absolute top-0 left-[25%] h-[80%]  opacity-95 z-0 hidden md:block"
            />

            <SceneElement
                src={lamp}
                alt="Lamp"
                className="top-0  left-[26%] w-[100px] hidden md:block "
            />
            <SceneElement
                src={lamp}
                alt="Lamp"
                className="top-0  left-[45%] w-[100px] hidden md:block"
            />
            <SceneElement
            src={lampMobile}
            alt='lamp mobile'
            className='sm:block md:hidden top-0  right-0 h-[15%] '
            />
            <SceneElement
            src={lampMobileLeft}
            alt='Lamp mobile'
            className='sm:block md:hidden top-0 left-0 h-[22%]'
            
            />
        
            <SceneElement
                src={Star1}
                alt='Star'
                className='top-[20%] h-[3%] left-[20%] md:top-[9%] md:left-[37%] md:h-[4%]'
                />
            <SceneElement
                src={Star1}
                alt='Star'
                className='top-[20%] h-[3%] left-[28%] md:top-[9%] md:left-[39%] md:h-[4%]'
                />
        </div>
    )
}
export default BackgroundLayer;