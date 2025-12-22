import type { RoomAsset } from "../../../../type/room.types";
import { File_URL } from "../../../../setting/constant/app";
const RoomAssets = ({ assets }: { assets: RoomAsset[] }) => {
  return (
    <div className="flex gap-4 text-xs text-gray-600 mt-2">
      {assets.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-2 px-3 py-1
                     bg-gray-100 rounded-full text-xs text-gray-700"
        >
          {a.thumbnail && (
            <img
              src={File_URL + a.thumbnail.url}
              alt={a.thumbnail.altText}
              className="w-4 h-4"
            />
          )}
          <span className="font-medium">

            {a.quantity}
          </span>
          <span>{a.assetName}</span>
        </div>
      ))}
    </div>
  );
};

export default RoomAssets;
