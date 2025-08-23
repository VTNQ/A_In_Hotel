const SideSlats=()=>{
    return(
    <>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex flex-col justify-center gap-6 opacity-60 z-0">
            <img
                src="/VectorLeft.png"
                alt="slats"
         className="h-full max-h-screen object-contain"
            />

        </div>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-center gap-6 opacity-60 z-0">
  <img
    src="/Vector.png"
    alt="slats"
    className="h-full max-h-screen object-contain"
  />
</div>


    </>
    )
}
export default SideSlats;