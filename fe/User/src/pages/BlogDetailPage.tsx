import { useNavigate, useParams } from "react-router-dom";
import type { BlogResponse } from "../type/blog.types";
import { useEffect, useState } from "react";
import { getBlog, getBlogById } from "../service/api/Blog";
import { File_URL } from "../setting/constant/app";
import { FiBookmark, FiHeart, FiShare2 } from "react-icons/fi";
import { ArrowRight } from "lucide-react";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogResponse[]>([]);
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const resp = await getBlogById(Number(id));
        setBlog(resp?.data?.data || null);
      } catch (err) {
        console.error("Get blog detail failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);
  useEffect(() => {
  if (!blog) return;

  const fetchRelated = async () => {
    try {
      const resp = await getBlog({
        page: 1,
        size: 3,
        filter: `status==2;id!=${blog.id}`,
      });

      setRelatedBlogs(resp?.content || []);
    } catch (err) {
      console.error("Get related blogs failed", err);
    }
  };

  fetchRelated();
}, [blog]);

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <span className="text-slate-500">Loading...</span>
      </div>
    );
  }

  if (!blog) return null;
  return (
    <main className="flex-1 " style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}>
      <section className="relative w-full h-[70vh] min-h-[520px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(
                to top,
                rgba(16, 25, 34, 0.9) 0%,
                rgba(16, 25, 34, 0.35) 55%,
                rgba(16, 25, 34, 0.15) 100%
              ),
              url('${File_URL + blog.image?.url}')
            `,
          }}
        ></div>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 text-center">
          <span className="bg-primary text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded mb-4 font-bold">
            {blog.category}
          </span>

          <h1
            className="text-white text-4xl md:text-6xl font-display font-bold max-w-4xl leading-tight mb-6"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
            <span>{formatDate(blog.createdAt)}</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <span>8 min read</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <span>By Elena Vance</span>
          </div>
        </div>
      </section>

      <div className="max-w-[800px] mx-auto px-6 py-16">
        <article className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          <p className="text-xl font-medium">
            {blog.description?.replace(/<[^>]*>/g, "")}
          </p>

          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between gap-6">
          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold">
              #{blog.category.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500 uppercase">
              Share
            </span>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <FiShare2 size={18} />
            </button>

            <button className="text-slate-400 hover:text-primary transition-colors">
              <FiHeart size={18} />
            </button>

            <button className="text-slate-400 hover:text-primary transition-colors">
              <FiBookmark size={18} />
            </button>
          </div>
        </div>
      </div>
      <section className="bg-slate-100 dark:bg-slate-900/50 py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Related Articles
            </h3>
            <a
              className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
              href="#"
            >
              View All blog <ArrowRight />
            </a>
          </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {relatedBlogs.map((item) => (
    <div
      key={item.id}
      onClick={()=>navigate(`/blog/${item.id}`)}
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group cursor-pointer"
    >
      <div className="h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={File_URL + item.image?.url}
          alt={item.title}
        />
      </div>

      <div className="p-6">
        <p className="text-primary text-[10px] font-bold uppercase mb-2">
          {item.category}
        </p>

        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">
          {item.title}
        </h4>

        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {item.description?.replace(/<[^>]*>/g, "")}
        </p>
      </div>
    </div>
  ))}

  {!loading && relatedBlogs.length === 0 && (
    <div className="col-span-full text-center text-sm text-gray-500">
      No related articles found.
    </div>
  )}
</div>

        </div>
      </section>
    </main>
  );
};
export default BlogDetailPage;
