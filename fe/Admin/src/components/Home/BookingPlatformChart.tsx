import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const BookingPlatformChart = () => {
  const dataValues = [420, 330, 120, 330, 220, 120, 120];

  const data = {
    labels: [
      "Direct Website",
      "Traveloka",
      "Booking.com",
      "Agoda",
      "Facebook",
      "Walk-in Guests",
      "Others",
    ],
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#93C5FD", // Light Blue
          "#86EFAC", // Light Green
          "#FDE68A", // Soft Yellow
          "#FCA5A5", // Soft Red
          "#C4B5FD", // Lavender
          "#A5F3FC", // Cyan
          "#E5E7EB", // Light Gray
        ],
        borderWidth: 3,
        borderColor: "#ffffff",
        hoverOffset: 10,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const value = context.raw;
            const percent = ((value / total) * 100).toFixed(1);
            return `${value} bookings (${percent}%)`;
          },
        },
      },
      datalabels: {
        color: "#374151",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => a + b,
            0,
          );
          const percent = ((value / total) * 100).toFixed(0);
          return percent + "%";
        },
      },
    },
  };

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 h-[420px]">
      <h3 className="text-lg font-semibold mb-4">Booking by platform</h3>

      <div className="h-[250px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default BookingPlatformChart;
