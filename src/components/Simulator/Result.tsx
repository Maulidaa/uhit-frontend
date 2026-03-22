import Chart from "./Chart";

type ResultProps = {
  co2: number;
  aqi: number;
  status: string;
  forestCount: number;
  vehicleCount: number;
};

function getStatusClass(status: string) {
  if (status === "Baik") {
    return "status-good";
  }
  if (status === "Sedang") {
    return "status-medium";
  }
  return "status-bad";
}

export default function Result({
  co2,
  aqi,
  status,
  forestCount,
  vehicleCount,
}: ResultProps) {
  return (
    <section className="result-panel">
      <h2>Hasil Simulasi</h2>
      <p className="result-lead">Ringkasan kondisi udara berdasarkan komposisi kota saat ini.</p>
      <div className="metric-grid">
        <article className="metric-card metric-forest">
          <h4>Area Hijau</h4>
          <p>{forestCount} petak</p>
        </article>
        <article className="metric-card metric-vehicle">
          <h4>Area Kendaraan</h4>
          <p>{vehicleCount} petak</p>
        </article>
        <article className="metric-card metric-co2">
          <h4>Emisi CO2</h4>
          <p>{co2.toFixed(2)}</p>
        </article>
        <article className="metric-card metric-aqi">
          <h4>Indeks AQI</h4>
          <p>{aqi.toFixed(2)}</p>
        </article>
      </div>
      <p className={`status-pill ${getStatusClass(status)}`}>Status Udara: {status}</p>
      <Chart co2={co2} aqi={aqi} />
    </section>
  );
}
