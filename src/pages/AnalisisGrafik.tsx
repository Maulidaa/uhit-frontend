import Navbar from "../components/Navbar/Navbar";
import {
  CategoryScale,
  type ChartOptions,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  type TooltipItem,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { temperatureSeries } from "../data/temperatureSeries.ts";
import "./AnalisisDetail.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AnalisisGrafik() {
  const latestRecord = temperatureSeries[temperatureSeries.length - 1];
  const maxNoSmoothing = Math.max(...temperatureSeries.map((item) => item.noSmoothing));

  const chartData = {
    labels: temperatureSeries.map((item) => item.year.toString()),
    datasets: [
      {
        label: "Annual mean",
        data: temperatureSeries.map((item) => item.noSmoothing),
        borderColor: "#6dc8b3",
        backgroundColor: "rgba(109, 200, 179, 0.2)",
        pointRadius: 0,
        borderWidth: 1.7,
        tension: 0.15,
      },
      {
        label: "Lowess smoothing",
        data: temperatureSeries.map((item) => item.lowess),
        borderColor: "#f0985f",
        backgroundColor: "rgba(240, 152, 95, 0.2)",
        pointRadius: 0,
        borderWidth: 2.8,
        tension: 0.28,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#d8ecf4",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            if (context.parsed.y == null) {
              return `${context.dataset.label ?? "Nilai"}: N/A`;
            }
            return `${context.dataset.label ?? "Nilai"}: ${context.parsed.y.toFixed(2)} C`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 12,
          color: "#b9d7e2",
        },
        grid: {
          color: "rgba(185, 215, 226, 0.12)",
        },
        title: {
          display: true,
          text: "Year",
          color: "#b9d7e2",
        },
      },
      y: {
        ticks: {
          color: "#b9d7e2",
        },
        grid: {
          color: "rgba(185, 215, 226, 0.12)",
        },
        title: {
          display: true,
          text: "Temperature Anomaly (C)",
          color: "#b9d7e2",
        },
      },
    },
  };

  return (
    <div className="analisis-detail-page">
      <Navbar />
      <main className="analisis-detail-content">
        <header className="detail-top">
          <p className="detail-kicker">Analisis Lanjutan</p>
          <h1>Grafik Land-Ocean Temperature Index (1880-2025)</h1>
          <p>Visual data tahunan mentah dan tren halus untuk melihat percepatan pemanasan global.</p>
        </header>

        <section className="detail-chart-summary">
          <article>
            <span>Data titik</span>
            <strong>{temperatureSeries.length} tahun</strong>
          </article>
          <article>
            <span>Peak anomali</span>
            <strong>{maxNoSmoothing.toFixed(2)} C</strong>
          </article>
          <article>
            <span>Nilai 2025</span>
            <strong>{latestRecord.noSmoothing.toFixed(2)} C</strong>
          </article>
        </section>

        <section className="detail-chart-wrap" aria-label="Grafik tren suhu global">
          <Line data={chartData} options={chartOptions} />
        </section>

        <Link to="/analisis" className="detail-back-link">Kembali ke halaman Analisis</Link>
      </main>
    </div>
  );
}

export default AnalisisGrafik;
