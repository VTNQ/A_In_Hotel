import { useEffect, useState } from "react";
import type { BlogResponse } from "../../type/blog.types";
import { getBlog } from "../../service/api/Blog";
import { File_URL } from "../../setting/constant/app";

const OurBlog = () => {
    const [blogs,setBlogs]=useState<BlogResponse[]>([]);
    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const res = await getBlog({
                    page:1,
                    size:3
                })
                setBlogs(res?.content || [])
            }catch(error:any){
                console.error("failed to load blog list")
            }
        }
        fetchData();
    },[])
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-17">
                <h2 className="text-center text-3xl  font-dmserif font-normal mb-10 text-[#4B3F30] " style={{ fontWeight:'400' }}>
                    Our blog
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {blogs.map((blog, index) => (
                        <div
                            key={index}
                            className="rounded-xl overflow-hidden shadow-sm"
                        >
                            <img
                                src={File_URL+blog.image.url}
                                alt={blog.image.altText}
                                className="w-full h-[520px] object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default OurBlog;