import { useEffect, useState } from "react";
import type { BlogResponse } from "../../type/blog.types";
import { getBlog } from "../../service/api/Blog";
import { File_URL } from "../../setting/constant/app";

const OurBlog = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBlog({
          page: 1,
          size: 3,
          filter: "status==2",
        });
        setBlogs(res?.content || []);
      } catch (error: any) {
        console.error("failed to load blog list");
      }
    };
    fetchData();
  }, []);
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-dmserif text-[#4B3F30] mb-8 sm:mb-12">
          Our Blog
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-6  sm:gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={File_URL + blog.image.url}
                  alt={blog.image.altText}
                  className="
                    w-full
                    h-[260px]
                    sm:h-[320px]
                    lg:h-[380px]
                    object-cover
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default OurBlog;
