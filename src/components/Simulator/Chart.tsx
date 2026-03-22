import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
);

type ChartProps = {
  co2: number;
  aqi: number;
};

export default function Chart({ co2, aqi }: ChartProps) {
  const data = {
    labels: ["CO2", "AQI"],
    datasets: [
      {
        label: "Simulasi",
        data: [co2, aqi],
        backgroundColor: ["#2f7d32", "#e36414"],
        hoverBackgroundColor: ["#25682a", "#cc5508"],
        borderRadius: 8,
        barThickness: 52,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f2f35",
        titleColor: "#f5fbfb",
        bodyColor: "#f5fbfb",
      },
    },
    animation: {
      duration: 650,
      easing: "easeOutQuart" as const,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#35545b",
        },
        grid: {
          color: "rgba(25, 68, 76, 0.15)",
        },
      },
      x: {
        ticks: {
          color: "#35545b",
          font: {
            weight: 700 as const,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="result-chart-wrap">
      <Bar data={data} options={options} />
    </div>
  );
}
