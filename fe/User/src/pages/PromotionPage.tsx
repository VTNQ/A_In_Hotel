import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BLOG_CATEGORIES, type BlogResponse } from "../type/blog.types";
import { getBlog } from "../service/api/Blog";
import { File_URL } from "../setting/constant/app";
import { useNavigate } from "react-router-dom";

const PromotionPage = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filter =
          category === 0 ? "status==2" : `status==2;category==${category}`;
        const resp = await getBlog({
          page,
          size: 6,
          filter,
        });
        setBlogs(resp?.content || []);
        setTotalPages(resp?.totalPages || 1);
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, category]);
  const PRIMARY_CATEGORIES = BLOG_CATEGORIES.slice(0, 6);
  const MORE_CATEGORIES = BLOG_CATEGORIES.slice(6);
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <header className="relative h-[260px] sm:h-[320px] md:h-[400px] flex items-center justify-center">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE4R7LVLgpL9pPAbzD0n3AeWkCB3OS-wVaJLnvUPoYtCB1CjaKYvETKqwsRkzenePfMPXpHPCzuijqyqTR49pM5mYFajSCosBdcG8JKHYmxrINQewHGQequ8lzjl0dA4mFRHsZDi8yiJTZA60w3ab5E9jKf-VT_6QWbz_byJp_lMP9WHNkmBoDWYKIjjMG9EmkFWmK7k1O9u7WGdkogefyC41Oc5DeM5v8akYDh5zfkLpZqITdFKX6AFp2z6eKO6-0A2PFj-8rT5vH"
          alt="Luxury Hotel Interior"
          className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl text-white font-display mb-4">
            Special offers
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto">
            Discover the latest special offers from A-IN-HOTEL
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 ">
        {/* ===== CATEGORY TABS ===== */}
        <div className="mb-16">
          {/* Row 1: Primary tabs + More */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
            {PRIMARY_CATEGORIES.map((item) => {
              const isActive = item.id === category;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCategory(item.id);
                    setPage(1);
                  }}
                  className={`
                    px-4 sm:px-6 
                    py-2 
                    text-xs sm:text-sm
                    font-semibold
                    transition  uppercase tracking-widest
                    ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-700 hover:text-primary"
                    }
                      `}
                >
                  {item.label}
                </button>
              );
            })}

            {/* MORE toggle button */}
            {!showMore && (
              <button
                onClick={() => setShowMore(true)}
                className={`px-6 py-2 transition font-semibold text-sm uppercase tracking-widest flex items-center gap-2
      ${
        MORE_CATEGORIES.some((c) => c.id === category)
          ? "text-primary border-b-2 border-primary"
          : "text-gray-700 hover:text-primary"
      }`}
                type="button"
              >
                <Plus /> More
              </button>
            )}
          </div>

          {/* Row 2: More categories (expanded as buttons) */}
          {showMore && (
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {MORE_CATEGORIES.map((item) => {
                const isActive = item.id === category;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCategory(item.id);
                      setPage(1);
                      setShowMore(false); // nếu bạn muốn chọn xong thì tự đóng
                    }}
                    className={`px-6 py-2 transition font-semibold text-sm uppercase tracking-widest
              ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          {!loading && blogs.length === 0 && (
            <div className="col-span-full text-center py-24">
              <p className="text-gray-500 text-sm uppercase tracking-widest">
                No articles found
              </p>
            </div>
          )}
          {!loading &&
            blogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-100
                dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={File_URL + blog.image.url}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 sm:p-6 lg:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-display font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-grow overflow-hidden line-clamp-3">
                    {blog.description?.replace(/<[^>]*>/g, "")}
                  </p>

                  <button
                    onClick={() => navigate(`/promotion/${blog.id}`)}
                    className="w-full bg-primary text-white py-3 px-6 text-xs font-bold uppercase tracking-wide hover:bg-opacity-90 transition"
                  >
                    Read more
                  </button>
                </div>
              </article>
            ))}
        </div>
        <div className="mt-20 flex justify-center items-center space-x-4">
          <button
            disabled={page == 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary hover:border-primary transition disabled:opacity-40"
          >
            <ArrowLeft />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            const isActive = pageNumber === page;

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full 
                  text-xs sm:text-sm font-bold transition
                  ${
                    isActive
                    ? "bg-primary text-white"
                    : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary"
                  }
                  `}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            disabled={page === totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary hover:border-primary transition disabled:opacity-40"
          >
            <ArrowRight />
          </button>
        </div>
      </main>
    </>
  );
};
export default PromotionPage;
