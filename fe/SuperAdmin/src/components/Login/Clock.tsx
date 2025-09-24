
import React, { useState } from "react";

// Clock Component
const Clock = () => {
  return (
    <div className="absolute top-20 right-20 z-30">
      <div className="w-24 h-24 rounded-full border-4 border-blue-500 bg-white flex items-center justify-center">
        <div className="relative w-16 h-16">
          {/* Clock face */}
          <div className="absolute inset-0 rounded-full border border-gray-300"></div>
          {/* Hour hand */}
          <div className="absolute top-1/2 left-1/2 w-0.5 h-5 bg-gray-800 origin-bottom transform -translate-x-1/2 -translate-y-full rotate-90"></div>
          {/* Minute hand */}
          <div className="absolute top-1/2 left-1/2 w-0.5 h-7 bg-gray-600 origin-bottom transform -translate-x-1/2 -translate-y-full rotate-0"></div>
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};
export default Clock;