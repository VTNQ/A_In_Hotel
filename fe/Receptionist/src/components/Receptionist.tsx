import SceneElement from './SceneElement';
import receptionist from '/receptionist.png';
const Receptionist = () => {
    return (
        <SceneElement
            src={receptionist}
            alt='Receptionist'
            className='bottom-[0] left-[22%] w-[20%] z-10 hidden md:block'
        />
    )
}
export default Receptionist;