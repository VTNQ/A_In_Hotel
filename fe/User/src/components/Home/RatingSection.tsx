"use client";
import { Star, StarHalf } from "lucide-react";

export default function RatingSection() {
  return (
    <section className="w-full py-12 bg-gradient-to-r from-[#fff7f0] to-[#f9f2e8] border-t border-blue-200 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-[#3A3125] mb-3">4.6</h1>
      <div className="flex items-center justify-center gap-1 text-yellow-400">
        <Star fill="currentColor" />
        <Star fill="currentColor" />
        <Star fill="currentColor" />
        <Star fill="currentColor" />
        <StarHalf fill="currentColor" />
      </div>
    </section>
  );
}
