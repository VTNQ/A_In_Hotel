import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ReservationItem } from "../../type/Statistics.types";

const ReservationChart = ({ data }: { data: ReservationItem[] }) => {
  if (!data || data.length === 0) return null;

  // Tính max động
  const maxValue = Math.max(...data.map(d => d.booked + d.canceled));
  const roundedMax =
    Math.ceil(maxValue / 5) * 5 || 5;

  return (
    <div className="bg-white shadow-sm border border-gray-100 p-6 rounded-3xl w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#1F2937]">
          Reservation
        </h3>
        <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm text-gray-600">
          Last 7 days
        </div>
      </div>

      {/* Custom Legend */}
      <div className="flex gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#32416B]" />
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FFCE7C]" />
          <span className="text-gray-600">Canceled</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
       
          >
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
              domain={[0, roundedMax]}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
              formatter={(value: number | undefined) =>
                (value ?? 0) + " Rooms"
              }
            />

            {/* STACK FULL WIDTH */}
            <Bar
              dataKey="booked"
              stackId="a"
              fill="#32416B"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="canceled"
              stackId="a"
              fill="#FFCE7C"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReservationChart;