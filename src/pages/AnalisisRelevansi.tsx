import Navbar from "../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import "./AnalisisDetail.css";

const indonesiaImpacts = [
  "Proyeksi suhu rata-rata nasional dapat meningkat lebih dari 1,3 C pada periode 2020-2049.",
  "Frekuensi hujan ekstrem, suhu tinggi ekstrem, dan periode kering berkepanjangan meningkat di beberapa wilayah.",
  "Kenaikan muka laut di perairan Indonesia berkisar 0,3-0,5 cm per tahun.",
  "Sebagai negara kepulauan dengan >17.000 pulau dan garis pantai 108.000 km, Indonesia sangat rentan terhadap risiko iklim.",
];

function AnalisisRelevansi() {
  return (
    <div className="analisis-detail-page">
      <Navbar />
      <main className="analisis-detail-content">
        <header className="detail-top">
          <p className="detail-kicker">Analisis Lanjutan</p>
          <h1>Relevansi untuk Indonesia</h1>
          <p>Dampak utama tren pemanasan global terhadap kondisi iklim dan kerentanan nasional.</p>
        </header>

        <section className="impact-grid" aria-label="Relevansi pemanasan global untuk Indonesia">
          {indonesiaImpacts.map((item) => (
            <article key={item} className="impact-card">
              <p>{item}</p>
            </article>
          ))}
        </section>

        <Link to="/analisis" className="detail-back-link">Kembali ke halaman Analisis</Link>
      </main>
    </div>
  );
}

export default AnalisisRelevansi;
