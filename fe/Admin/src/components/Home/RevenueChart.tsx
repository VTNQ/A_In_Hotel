import type { RevenueItem } from "../../type/Statistics.types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const RevenueChart = ({ data }: { data: RevenueItem[] }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[420px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Revenue
        </h3>
        <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm text-gray-600">
          Last 7 days
        </div>
      </div>

      {/* Chart container FIX */}
      <div className="w-full h-[260px] rounded-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#32416B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#32416B" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) =>
                `${(value / 1000).toFixed(0)}K`
              }
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#32416B"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                stroke: "#32416B",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;