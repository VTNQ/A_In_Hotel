import { useEffect, useState } from "react"

const useCountdown=(initialSeconds:any)=>{
    const [secondsLeft,setSecondsLeft] = useState(initialSeconds);
    useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev:any) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = () => {
    const h = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
    const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
    const s = String(secondsLeft % 60).padStart(2, "0");
    return `${h} : ${m} : ${s}`;
  };

  return { secondsLeft, formatTime };
}
export default useCountdown;