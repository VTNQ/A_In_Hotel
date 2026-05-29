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
          "#93C5FD",
          "#86EFAC",
          "#FDE68A",
          "#FCA5A5",
          "#C4B5FD",
          "#A5F3FC",
          "#E5E7EB",
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
          color: "#6B7280",
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
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
            0
          );
          const percent = ((value / total) * 100).toFixed(0);
          return percent + "%";
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 h-[420px] transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Booking by platform
      </h3>

      <div className="h-[250px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default BookingPlatformChart;