import { useState } from "react";

const GuestInformation = () => {
  const [work, setWork] = useState("yes");
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="font-semibold text-lg mb-1 border-b pb-2 border-[#707070]">
        Your Information
      </h3>
      <p className="text-[14px] text-green-600 mb-4 mt-3">
        Almost done! Just fill in the required information.
      </p>
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Are you traveling for work?</p>
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="work"
              value="yes"
              checked={work === "yes"}
              onChange={() => setWork("yes")}
              className="peer hidden"
            />

            <span
              className="
      relative w-5 h-5 rounded-full border-2 border-[#8b6f4e]
      flex items-center justify-center
      after:content-['']
      after:w-3 after:h-3 after:rounded-full
      after:bg-[#8b6f4e]
      after:scale-0 after:transition
      peer-checked:after:scale-100
    "
            />

            <span className="text-sm">Yes</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="work"
              value="no"
              checked={work === "no"}
              onChange={() => setWork("no")}
              className="peer hidden"
            />

            <span
              className="
      relative w-5 h-5 rounded-full border-2 border-[#8b6f4e]
      flex items-center justify-center
      after:content-['']
      after:w-3 after:h-3 after:rounded-full
      after:bg-[#8b6f4e]
      after:scale-0 after:transition
      peer-checked:after:scale-100
    "
            />

            <span className="text-sm">No</span>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="w-full">
          <label className="block text-sm text-[#181818] font-medium mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            className="
          w-full h-12 px-4
          rounded-lg
          border border-gray-200
          text-sm text-gray-900
          bg-[#F2F2F2]
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-blue-400
          focus:border-blue-400
          transition
        "
          />
        </div>
        <div className="w-full">
          <label className="block text-sm text-[#181818] font-medium mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            className="
          w-full h-12 px-4
          rounded-lg
          border border-gray-200
          text-sm text-gray-900
          bg-[#F2F2F2]
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-blue-400
          focus:border-blue-400
          transition
        "
          />
        </div>
        <div className="w-full">
          <label className="block text-sm text-[#181818] font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            className="
          w-full h-12 px-4
          rounded-lg
          border border-gray-200
          text-sm text-gray-900
          placeholder:text-gray-400
          bg-[#F2F2F2]
          focus:outline-none
          focus:ring-2 focus:ring-blue-400
          focus:border-blue-400
          transition
        "
          />
        </div>
        <div className="w-full">
          <label className="block text-sm text-[#181818] font-medium mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-12 px-4
                 rounded-lg border border-gray-200 text-sm
                 text-gray-900 placeholder:text-gray-400
                 bg-[#F2F2F2] focus:outline-none focus:ring-2
                 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>
      </div>
      <div>
        <div className="w-full">
          <label className="block text-sm text-[#181818] font-medium mb-1">
            Salutation
          </label>
          <input
            className="
          w-full h-12 px-4
          rounded-lg
          border border-gray-200
          text-sm text-gray-900
          bg-[#F2F2F2]
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-blue-400
          focus:border-blue-400
          transition
        "
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Special requests to hotel</label>
        <textarea
          rows={3}
          className="w-full mt-1 border outline-none rounded-md p-2 bg-[#F2F2F2] text-sm focus:outline-none
          focus:ring-2 focus:ring-blue-400
          focus:border-blue-400
          transition"
        />
      </div>
    </div>
  );
};
export default GuestInformation;