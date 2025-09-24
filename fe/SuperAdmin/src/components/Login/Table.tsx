import React from "react";

// Component cho một bên chân bàn
const TableLegs: React.FC<{ position: "left" | "right" }> = ({ position }) => {
  return (
    <div
      className={`absolute top-9 flex flex-col items-center ${
        position === "left" ? "left-1/5" : "right-1/5"
      }`}
    >
      <div className="relative w-36 h-52">
        {/* Thanh chéo trái */}
        <div className="absolute top-0 left-9 w-0.5 h-full bg-[#b9c9ff] origin-top rotate-[12deg] rounded"></div>
        {/* Thanh chéo phải */}
        <div className="absolute top-0 right-9 w-0.5 h-full bg-[#b9c9ff] origin-top -rotate-[12deg] rounded"></div>
        {/* Thanh ngang giữa */}
        <div className="absolute top-28 left-6 right-6 h-0.5 bg-[#b9c9ff] rounded"></div>
      </div>
    </div>
  );
};

// Component bàn
const Table: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-[56rem] max-w-[92vw] h-60 z-10">
      {/* Mặt bàn */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#4A6FF3]"></div>

      {/* Thanh đen dưới mặt bàn */}
      <div className="absolute top-1.5 left-1/5 w-24 h-1.5 bg-[#11243d] rounded"></div>
      <div className="absolute top-1.5 right-1/5 w-24 h-1.5 bg-[#11243d] rounded"></div>

      {/* Hai chân bàn chữ A */}
      <TableLegs position="left" />
      <TableLegs position="right" />

      {/* Form nằm trên bàn */}
      <div className="absolute -top-56 md:-top-72 left-1/2 -translate-x-1/2 z-30 w-80 md:w-[26rem]">
        {children}
      </div>
    </div>
  );
};

export default Table;
