import type { RoomAsset } from "../../../../type/room.types";
import { File_URL } from "../../../../setting/constant/app";

const RoomAssets = ({ assets = [] }: { assets?: RoomAsset[] }) => {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-2">

      {assets.map((a) => (
        <div
          key={a.id}
          className="
            flex items-center gap-2 px-3 py-1 rounded-full text-xs
            bg-gray-100 text-gray-700
            dark:bg-gray-700 dark:text-gray-200
          "
        >
          {a.thumbnail && (
            <img
              src={File_URL + a.thumbnail.url}
              alt={a.thumbnail.altText}
              className="w-4 h-4"
            />
          )}

          <span className="font-medium text-gray-800 dark:text-gray-100">
            {a.quantity}
          </span>

          <span className="text-gray-700 dark:text-gray-300">
            {a.assetName}
          </span>
        </div>
      ))}

    </div>
  );
};

export default RoomAssets;