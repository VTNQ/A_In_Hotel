import { useAlert } from "@/components/alert-context";
import { createOrUpdateFranchise, getFranchise } from "@/service/api/Franchise";
import { File_URL } from "@/setting/constant/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FranchisePage = () => {
  const franchiseSchema = z.object({
    id: z.string().optional(),
    title: z.string().trim().min(1, "Tiêu đề không được để trống"),
    subTitle: z.string().optional(),
    description: z.string().optional(),
    image: z.any().optional(),
    primaryButtonText: z.any().optional(),
    primaryButtonUrl: z.string().optional(),
    secondaryButtonText: z.any().optional(),
    secondaryButtonUrl: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
  });
  const { showAlert } = useAlert();
  type FranchiseForm = z.infer<typeof franchiseSchema>;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FranchiseForm>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: {
      title: "",
      subTitle: "",
      description: "",
      primaryButtonText: "",
      primaryButtonUrl: "",
      secondaryButtonText: "",
      secondaryButtonUrl: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("image", file);

    setPreview(URL.createObjectURL(file));
  };
  const [preview, setPreview] = useState("");
  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        const response = await getFranchise();
        const franchise = response.data.data;
        reset({
          id: franchise.id?.toString(),
          title: franchise.title || "",
          subTitle: franchise.subTitle || "",
          description: franchise.description || "",
          primaryButtonText: franchise.primaryButtonText || "",
          primaryButtonUrl: franchise.primaryButtonUrl || "",
          secondaryButtonText: franchise.secondaryButtonText || "",
          secondaryButtonUrl: franchise.secondaryButtonUrl || "",
          metaTitle: franchise.metaTitle || "",
          metaDescription: franchise.metaDescription || "",
          metaKeywords: franchise.metaKeywords || "",
        });

        if (franchise.bannerImage?.url) {
          setPreview(File_URL+franchise.bannerImage.url);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFranchise();
  },[reset]);
  const onSubmit = async (data: FranchiseForm) => {
    try {
      await createOrUpdateFranchise(data);
      showAlert({
        title: "Cập nhật thành công",
        type: "success",
        autoClose: 300,
      });
    } catch (err) {
      showAlert({
        title: "Cập nhật thất bại",
        type: "error",
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-950 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Franchise Content</h1>
        <p className="text-sm text-gray-500 mt-1">
          System Management / Franchise
        </p>
      </div>
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow border dark:border-neutral-800">
        <div className="px-6 py-4 border-b dark:border-neutral-800">
          <h2 className="font-medium dark:text-white">Franchise Information</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Banner Image
            </label>
            <div className="flex gap-4 items-start">
              {preview && (
                <div className="w-[220px] h-[120px] border rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label
                className="flex flex-col items-center justify-center border-2 border-dashed
              rounded-lg h-[120px] flex-1 cursor-pointer"
              >
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <span className="text-blue-600">Upload Banner</span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP
                </span>
              </label>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                {...register("title")}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-md text-sm
                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <input
                {...register("subTitle")}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 rounded-md text-sm
                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows={6}
              {...register("description")}
              className="w-full border rounded-md p-3"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Primary Button</h3>
              <input
                {...register("primaryButtonText")}
                placeholder="Button text"
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                {...register("primaryButtonUrl")}
                placeholder="Button url"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Secondary Button</h3>

              <input
                {...register("secondaryButtonText")}
                placeholder="Button text"
                className="w-full border rounded-md px-3 py-2"
              />
              <input
                {...register("secondaryButtonUrl")}
                placeholder="Button url"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="border-t pt-6">
            <h2 className="font-semibold mb-4">SEO information</h2>
            <div className="space-y-4">
              <input
                {...register("metaTitle")}
                placeholder="Meta Title"
                className="w-full border rounded-md px-3 py-2"
              />
              <textarea
                rows={4}
                {...register("metaDescription")}
                placeholder="Meta Description"
                className="w-full border rounded-md px-3 py-2"
              />
              <textarea
                rows={4}
                {...register("metaKeywords")}
                placeholder="Meta Keywords"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end border-t pt-6">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FranchisePage;
