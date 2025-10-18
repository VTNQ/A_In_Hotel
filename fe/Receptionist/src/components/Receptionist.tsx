import SceneElement from './SceneElement';
import receptionist from '/receptionist.png';
const Receptionist = () => {
    return (
        <SceneElement
            src={receptionist}
            alt='Receptionist'
            className='bottom-0 left-[23%] w-[280px] z-10 hidden md:block'
        />
    )
}
export default Receptionist;