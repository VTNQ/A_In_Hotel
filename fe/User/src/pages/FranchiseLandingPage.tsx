import { useEffect, useState } from "react";
import type { FranchiseResponse } from "../type/franchise.type";
import { getFranchise } from "../service/api/Franchise";
import { getFranchiseSections } from "../service/api/FrachiseSection";
import type {
  franchiseSectionItemResponse,
  franchiseSectionResponse,
} from "../type/franchiseSection.type";
import { File_URL } from "../setting/constant/app";
import { useForm } from "react-hook-form";
import type { franchiseInquiryFrom } from "../type/franchiseInquiry.type";
import { useAlert } from "../components/alert-context";
import { createFranchiseInquiry } from "../service/api/FranchiseInquiry";

const FranchiseLandingPage = () => {
  const [franchise, setFranchise] = useState<FranchiseResponse | null>(null);
  const [sections, setSections] = useState<franchiseSectionResponse[]>([]);
  const { showAlert } = useAlert();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<franchiseInquiryFrom>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      province: "",
      investmentBudget: "",
      propertyLocation: "",
      landArea: "",
      roomCount: "",
      message: "",
    },
  });
  const onSubmit = async (data: franchiseInquiryFrom) => {
    try {
      await createFranchiseInquiry(data);

      showAlert({
        type: "success",
        title: "Gửi yêu cầu thành công",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      });

      reset();
    } catch (error: any) {
      console.error(error);

      showAlert({
        type: "error",
        title: "Gửi yêu cầu thất bại",
        description:
          error?.response?.data?.message ||
          "Đã có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [franchiseRes, sectionRes] = await Promise.all([
        getFranchise(),
        getFranchiseSections({
          page: 1,
          size: 100,
          filter: "active==true",
          sort: "sortOrder,asc",
        }),
      ]);
      setFranchise(franchiseRes?.data?.data ?? null);
      setSections(sectionRes.data?.content || []);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <section className="relative min-h-[921px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            loading="lazy"
            className="w-full h-full object-cover"
            src={`${File_URL}${franchise?.bannerImage?.url}`}
            alt={franchise?.bannerImage?.altText}
          />
          <div className="absolute inset-0 bg-[rgb(1,38,31)]/20 mix-blend-multiply" />
        </div>
        <div className="relative z-10 px-[48px] max-w-[1280px] mx-auto w-full">
          <div className="max-w-2xl bg-[rgb(255,248,245)]/90 backdrop-blur-sm p-12 md:p-16">
            <span
              className="font-serif text-[12px] line-clamp-1 font-semibold text-[rgb(149,72,36)] tracking-widest
            block mb-4 uppercase"
            >
              Urban Sanctuary
            </span>
            <h1
              className="font-headline text-[48px] line-clamp-1 text-[rgb(1,38,31)] mb-6
            font-normal"
              style={{ letterSpacing: "-0.02em" }}
            >
              {franchise?.title}
            </h1>
            <p className="font-serif text-[18px] font-normal text-on-surface mb-10 leading-relaxed">
              {franchise?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              {franchise?.primaryButtonText && (
                <a
                  href={franchise.primaryButtonUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
        inline-flex items-center justify-center
        bg-[rgb(149,72,36)]
        text-white
        px-10 py-5
        font-serif
        text-[12px]
        font-semibold
        tracking-widest
        uppercase
        hover:bg-[rgb(117,48,13)]
        transition-all
      "
                >
                  {franchise.primaryButtonText}
                </a>
              )}

              {franchise?.secondaryButtonText && (
                <a
                  href={franchise.secondaryButtonUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
        inline-flex items-center justify-center
        border border-[rgb(149,72,36)]
        text-[rgb(149,72,36)]
        px-10 py-5
        font-serif
        text-[12px]
        font-semibold
        tracking-widest
        uppercase
        hover:bg-[rgb(149,72,36)]
        hover:text-white
        transition-all
      "
                >
                  {franchise.secondaryButtonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      {sections.map((section) => (
        <section key={section.id} className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              {section.subTitle && (
                <p className="uppercase tracking-[0.25em] text-[#954824] text-sm mb-4">
                  {section.subTitle}
                </p>
              )}

              <h2 className="text-4xl font-semibold text-[#01261f] mb-5">
                {section.title}
              </h2>

              {section.description && (
                <p className="max-w-3xl mx-auto text-gray-600 leading-8">
                  {section.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {section.items
                ?.sort((a, b) => a.sortOrder - b.sortOrder)
                .map((item: franchiseSectionItemResponse) => (
                  <div
                    key={item.id}
                    className="
                      p-8
                      border
                      rounded-xl
                      bg-white
                      hover:border-[#954824]
                      hover:shadow-lg
                      transition
                    "
                  >
                    {item.icon && (
                      <img
                        src={`${File_URL}${item.icon.url}`}
                        alt={item.icon.altText}
                        className="w-16 h-16 object-contain mb-6"
                      />
                    )}

                    <h3 className="text-xl font-semibold mb-4">{item.title}</h3>

                    <p className="text-gray-600 leading-7">
                      {item.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      ))}
      {/* <section className="py-[120px] px-[48px] max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2
              className="text-[32px] line-clamp-1 font-normal
                text-[rgb(1,38,31)] mb-4 font-headline"
              style={{ letterSpacing: "-0.01em" }}
            >
              Modern Tropical Aesthetic
            </h2>
            <p className="font-serif text-[16px] font-normal text-on-surface leading-8">
              Architecture that breathes. Our spaces integrate lush greenery
              with clean, minimalist lines to create a living environment that
              promotes well-being and social equity.
            </p>
          </div>
          <div
            className="font-sans text-[12px] line-clamp-1 font-semibold
          text-[rgb(149,72,36)] border-b border-[rgb(149,72,36)] pb-1 cursor-pointer"
            style={{ letterSpacing: "0.08rem" }}
          >
            VIEW FULL GALLERY
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">
          <div className="md:col-span-7 h-[600px] overflow-hidden">
            <img
              loading="lazy"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2zHkJSZD9zsRxjOXasGl9dUy9gCckrMRCwsVHel0OfXh4vqr-4acQY61UAS_d8NkbkQmTNhnK5Yu_iccrb-Ab8VWwp6AI9E2zA0-7Ac4vemhHLJrLZYod0GE9CD-r-fycx1fRztb3tSN00iRV1eXppINcLDZ-M1b56tswJLJzYfQWzcRYDXBABnfRliYQafNqHTchA0_cKafLzKKnW9cBewVIJY-Yxhk42HDKWQbxDmtNrU5UU5K0hLGQxoB36S-imFLBzsO6MT4"
            />
          </div>
          <div className="md:col-span-5 flex flex-col gap-[24px]">
            <div className="h-[288px] overflow-hidden">
              <img
                loading="lazy"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3jfdb8DuGTgDDlcmuVhc1w53IPjIw-8_HklWyKleQZAo1_WSTAIWhAwfI76YLqceXWI-kNuYxO-V37bTFjhBwCJ9TNZF_YK6oilhsLXwGNbbqYAJVhgz2drJeRcCfKqY2-JwPl2m70FdM7Weo0wb6J5g9nschSJ-SiLRGl10FqI8S_wNUCgQsSCtATOuRN1_K9AI0Hu4C2KcivFxFiC_zzJqUuOUmYlMFWyTO3Nc-WNXnhOr5tUUlLaohk2KCypadLkzf7TZkuWk"
              />
            </div>
            <div className="h-[288px] overflow-hidden">
              <img
                loading="lazy"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHbQnl4L4GlftqgiVoN6cSbdYrTwlxwbL1ziYKkx_VjAwhSMiEBI2X_PigrGoey0E10_woSb0Yuk98Td9v26z-PQNFTMW9WUU6q3-lGNDoGghTNz3JYw35iR2qMMoEy9fKvL2-4IfTOdsD0DtBRry_Kj4kq69cIaGjSRhAN29GeRJqoh2ZzvASaHinNZ_zXhMArsmtsOjOBMrhCXhDg_9dAzTmuk8dLQw1JW2qWYBQgctQEu4bv9bGQC5oqbkZ3UjdNiewYTcWJLI"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[rgb(245,236,231)] py-[120px]">
        <div
          className="px-[48px] max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2
        gap-24 items-center"
        >
          <div className="relative order-2 md:order-1">
            <div
              className="bg-[rgb(26,60,52)] w-full aspect-square 
                absolute top-8 left-8 opacity-10"
              style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
            ></div>
            <img
              loading="lazy"
              className="relative z-10 w-full h-auto object-cover border border-[rgb(193,200,196)] "
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDudmWEeaFvJtAhZU4DOVu7vcmXwvqFlzkxLndWHQKPJhSg36Esfb9hCKd-Ehnv5VH0Kl5c7Ef-Z6PZbPE2hLWZ50t0atLIeCzOIm2LN9crIR8myYwyccPpr7qQxC8PIsg6cxMCjNVfxbD_GXhjzEe4j7R3YQpf-_f7pkZ0SnC-8AUP1kzM1woc7Svpy9Qpanao1Nr6NHu6Y9fK9qCg1FdK18lDOjwwCKm_eZ3FwdORlZ3h7_bOCgKumLVXiREb30-DFWciWnocEcM"
            />
          </div>
          <div className="order-1 md:order-2">
            <span
              className="font-sans text-[12px] line-clamp-1 font-normal text-[rgb(149,72 36)]
            tracking-widest block mb-4 uppercase"
            >
              Social Equity
            </span>
            <h2
              className="font-headline text-[32px] font-normal text-[rgb(1,38,31)] leading-tight mb-8"
              style={{ letterSpacing: "-0.01em" }}
            >
              The Community Value
            </h2>
            <div className="space-y-8">
              <div>
                <h4 className="font-headline text-[24px] line-clamp-1 font-normal text-[rgb(1,38,31)] mb-2">
                  Digital Nomad Hubs
                </h4>
                <p className="text-[16px]  font-normal font-sans text-on-surface">
                  Purpose-built co-working spaces integrated into your home,
                  fostering productivity and serendipitous connections.
                </p>
              </div>
              <div>
                <h4 className="font-headline text-[24px] line-clamp-1 font-normal text-[rgb(1,38,31)] mb-2">
                  Curated Social Events
                </h4>
                <p className="text-[16px]  font-normal font-sans text-on-surface">
                  From architectural talks to local wine tastings, we curate
                  experiences that bring the village together.
                </p>
              </div>
              <div>
                <h4 className="font-headline text-[24px] line-clamp-1 font-normal text-[rgb(1,38,31)] mb-2">
                  Shared Growth
                </h4>
                <p className="text-[16px]  font-normal font-sans text-on-surface">
                  A network of residents and partners committed to sustainable
                  urban development and collective success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* <div className="bg-[rgb(255,248,245)]">
        <section className="py-[120px] px-[48px] max-w-[1280px] mx-auto text-center">
          <h2
            className="font-headline text-[32px] leading-3 font-normal 
        text-[rgb(1,38,31)] mb-16"
          >
            The Path to Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px]">
            <div
              className="p-8 border border-[rgb(193,200,196)] 
            hover:border-[rgb(149,72,36)] transition-colors group"
            >
              <div
                className="w-12 h-12 bg-[rgb(1,38,31)] text-white flex items-center justify-center
                font-headline mb-6 mx-auto"
              >
                1
              </div>
              <h3
                className="font-headline text-[24px] leading-4 font-normal 
                text-[rgb(1,38,1)] mb-4"
              >
                Discovery
              </h3>
              <p className="font-sans text-[16px] leading-6 font-normal text-on-surface">
                We explore potential sites that offer unique architectural
                possibilities and community potential.
              </p>
            </div>
            <div
              className="p-8 border border-[rgb(193,200,196)] 
            hover:border-[rgb(149,72,36)] transition-colors group"
            >
              <div
                className="w-12 h-12 bg-[rgb(1,38,31)] text-white flex items-center justify-center
                font-headline mb-6 mx-auto"
              >
                2
              </div>
              <h3
                className="font-headline text-[24px] leading-4 font-normal 
                text-[rgb(1,38,1)] mb-4"
              >
                Design
              </h3>
              <p className="font-sans text-[16px] leading-6 font-normal text-on-surface">
                Applying our tropical minimalist aesthetic to create breathable,
                social living spaces.
              </p>
            </div>
            <div
              className="p-8 border border-[rgb(193,200,196)] 
            hover:border-[rgb(149,72,36)] transition-colors group"
            >
              <div
                className="w-12 h-12 bg-[rgb(1,38,31)] text-white flex items-center justify-center
                font-headline mb-6 mx-auto"
              >
                3
              </div>
              <h3
                className="font-headline text-[24px] leading-4 font-normal 
                text-[rgb(1,38,1)] mb-4"
              >
                Onboarding
              </h3>
              <p className="font-sans text-[16px] leading-6 font-normal text-on-surface">
                Seamless integration for our residents, handled by our expert
                hospitality team.
              </p>
            </div>
            <div
              className="p-8 border border-[rgb(193,200,196)] 
            hover:border-[rgb(149,72,36)] transition-colors group"
            >
              <div
                className="w-12 h-12 bg-[rgb(1,38,31)] text-white flex items-center justify-center
                font-headline mb-6 mx-auto"
              >
                4
              </div>
              <h3
                className="font-headline text-[24px] leading-4 font-normal 
                text-[rgb(1,38,1)] mb-4"
              >
                Community
              </h3>
              <p className="font-sans text-[16px] leading-6 font-normal text-on-surface">
                Ongoing management and event curation to ensure the village
                thrives indefinitely.
              </p>
            </div>
          </div>
        </section>
      </div> */}
      <section className="bg-[rgb(1,38,31)] text-white py-[120px]">
        <div className="px-[48px] max-w-3xl mx-auto text-center">
          <h2
            className="font-headline text-[32px] leading-5 font-normal text-white mb-6"
            style={{ letterSpacing: "-0.01em" }}
          >
            Join the Village
          </h2>
          <p
            className="text-[18px] leading-7 font-normal font-serif text-[rgb(197,234,223)]
            mb-12"
          >
            Whether you are an investor, a partner, or a future resident, we
            invite you to be part of our urban sanctuary.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 text-left bg-[rgb(255,248,245)] p-12 shadow-sm"
          >
            <div className="border-b border-[rgb(1,38,31)] py-2">
              <label
                className="block  font-sans text-[rgb(1,38,31)] text-[12px] leading-5 font-semibold"
                style={{ letterSpacing: "0.08em" }}
              >
                Họ tên
              </label>
              <input
                className="w-full outline-none bg-transparent border-none focus:ring-0 text-on-surface
                        placeholder:text-outline-variant font-serif"
                placeholder="Họ tên Quý khách"
                {...register("fullName", {
                  required: "Vui lòng nhập họ tên",
                })}
                type="text"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-b border-[rgb(1,38,31)] py-2">
                <label
                  className="block font-sans text-[rgb(1,38,31)] text-[12px] leading-5 font-semibold"
                  style={{ letterSpacing: "0.08em" }}
                >
                  Email
                </label>
                <input
                  className="w-full outline-none bg-transparent border-none focus:ring-0 text-on-surface
                          placeholder:text-outline-variant font-serif"
                  placeholder="abc@gmail.com"
                  {...register("email", {
                    required: "Vui lòng nhập email",
                  })}
                  type="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="border-b border-[rgb(1,38,31)] py-2">
                <label
                  className="block font-sans text-[rgb(1,38,31)] text-[12px] leading-5 font-semibold"
                  style={{ letterSpacing: "0.08em" }}
                >
                  Số điện thoại
                </label>
                <input
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                  })}
                  className="w-full outline-none bg-transparent border-none focus:ring-0 text-on-surface
                          placeholder:text-outline-variant font-serif"
                  placeholder="+84 123 456 789"
                  type="tel"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="border-b border-[rgb(1,38,31)] py-2">
              <label
                className="block font-sans text-[rgb(1,38,31)] text-[12px] leading-5 font-semibold"
                style={{ letterSpacing: "0.08em" }}
              >
                Khu vực
              </label>
              <select
                {...register("province")}
                className="w-full outline-none bg-transparent border-none focus:ring-0 text-on-surface font-serif"
              >
                <option value="">Tỉnh/thành phố</option>
                <option value="HCM">TP.HCM</option>
                <option value="Ha Noi">Hà Nội</option>
              </select>
              
            </div>

            <div className="border-b border-[rgb(1,38,31)] py-2">
              <label
                className="block font-sans text-[rgb(1,38,31)] text-[12px] leading-5 font-semibold"
                style={{ letterSpacing: "0.08em" }}
              >
                Vị trí bất động sản
              </label>
              <input
                {...register("propertyLocation", {
                  required: "Vui lòng nhập vị trí bất động sản",
                })}
                className="w-full outline-none bg-transparent border-none focus:ring-0 text-on-surface
                        placeholder:text-outline-variant font-serif"
                placeholder="Vui lòng nhập địa chỉ cụ thể bất động sản"
                type="text"
              />
              {errors.propertyLocation && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.propertyLocation.message}
                  </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-b border-[rgb(1,38,31)] py-2">
                <label
                  className="block font-sans text-[rgb(1,38,31)] text-[12px] leading-5 font-semibold"
                  style={{ letterSpacing: "0.08em" }}
                >
                  Tổng diện tích đất (m²)
                </label>
                <input
                  {...register("landArea", {
                    required: "Vui lòng nhập diện tích đất",
                  })}
                  className="w-full outline-none bg-transparent border-none focus:ring-0 text-on-surface
                          placeholder:text-outline-variant font-serif"
                  placeholder="Tối thiểu 250 m²"
                  type="text"
                />
                {errors.landArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.landArea.message}
                  </p>
                )}
              </div>
              <div className="border-b border-[rgb(1,38,31)] py-2">
                <label
                  className="block font-sans text-[rgb(1,38,31)] text-[12px] leading-5 font-semibold"
                  style={{ letterSpacing: "0.08em" }}
                >
                  Số phòng
                </label>
                <input
                  {...register("roomCount", {
                    required: "Vui lòng nhập số phòng",
                  })}
                  className="w-full outline-none bg-transparent border-none focus:ring-0 text-on-surface
                          placeholder:text-outline-variant font-serif"
                  placeholder="Tối thiểu 30 phòng"
                  type="text"
                />
                {errors.roomCount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.roomCount.message}
                  </p>
                )}
              </div>
            </div>
            <div className="border-b border-[rgb(1,38,31)] py-2">
              <label
                className="block font-sans text-[rgb(1,38,31)] text-[12px] leading-5 font-semibold"
                style={{ letterSpacing: "0.08em" }}
              >
                Ngân sách đầu tư
              </label>

              <input
                {...register("investmentBudget")}
                className="w-full outline-none bg-transparent border-none focus:ring-0 text-on-surface
    placeholder:text-outline-variant font-serif"
                placeholder="Ví dụ: 10 tỷ VNĐ"
                type="text"
              />
                {errors.investmentBudget && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.investmentBudget.message}
                  </p>
                )}
            </div>
            <div className="border-b border-[rgb(1,38,31)] py-2">
              <label
                className="block font-sans text-[12px] leading-3 font-semibold text-[rgb(1,38,31)] uppercase mb-1"
                style={{ letterSpacing: "0.08rem" }}
              >
                Message
              </label>
              <textarea
              {...register("message")}
                className="w-full bg-transparent outline-none border-none focus:ring-0 text-on-surface placeholder:text-outline-variant font-serif resize-none"
                rows={4}
                placeholder="Tell us how you'd like to collaborate..."
              ></textarea>
            </div>
            <button className="w-full bg-[rgb(149,72,36)] text-white py-5 font-serif text tracking-widest uppercase hover:bg-on-secondary-container transition-all">
              Gửi thông tin
            </button>
          </form>
        </div>
      </section>
    </>
  );
};
export default FranchiseLandingPage;
