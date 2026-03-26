import Navbar from "../components/Navbar/Navbar";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaCloud, FaGlobeAsia, FaSnowflake, FaWater } from "react-icons/fa";
import "./AnalisisDetail.css";

type DriverItem = {
  title: string;
  description: string;
  detail: string;
  badge: string;
  icon: ReactNode;
};

const driverItems: DriverItem[] = [
  {
    title: "Konsentrasi GRK Mencapai Rekor",
    description:
      "Konsentrasi gas rumah kaca seperti CO2, CH4, dan N2O kembali mencapai level tertinggi sepanjang sejarah.",
    detail:
      "Akumulasi GRK memperkuat efek rumah kaca dan menahan lebih banyak panas di atmosfer dalam jangka panjang.",
    badge: "CO2, CH4, N2O",
    icon: <FaCloud aria-hidden="true" />,
  },
  {
    title: "Lautan Menyimpan Panas Lebih Tinggi",
    description:
      "Lautan mengalami peningkatan panas signifikan, dengan suhu permukaan laut global (SST) rata-rata tertinggi yang pernah tercatat.",
    detail:
      "Laut menyerap sebagian besar panas berlebih akibat pemanasan global, lalu memengaruhi cuaca ekstrem dan ekosistem laut.",
    badge: "SST Rekor",
    icon: <FaWater aria-hidden="true" />,
  },
  {
    title: "Es Laut Menyusut di Dua Kutub",
    description:
      "Es laut Arktik dan Antarktik berada pada luasan minimum dan maksimum yang jauh di bawah normal.",
    detail:
      "Penyusutan es menurunkan albedo bumi, sehingga lebih banyak radiasi matahari diserap permukaan laut dan daratan.",
    badge: "Arktik + Antarktik",
    icon: <FaSnowflake aria-hidden="true" />,
  },
  {
    title: "Muka Laut Terus Naik Cepat",
    description:
      "Permukaan laut global terus naik dengan laju sekitar 4,1 mm per tahun, hampir dua kali lipat dibandingkan dua dekade sebelumnya.",
    detail:
      "Gabungan pencairan es dan pemuaian termal air laut meningkatkan ancaman banjir rob, abrasi, dan intrusi air laut.",
    badge: "4,1 mm/tahun",
    icon: <FaGlobeAsia aria-hidden="true" />,
  },
];

function AnalisisPenyebab() {
  return (
    <div className="analisis-detail-page">
      <Navbar />
      <main className="analisis-detail-content">
        <header className="detail-top">
          <p className="detail-kicker">Analisis Lanjutan</p>
          <h1>Penyebab Tren Pemanasan Global 2025</h1>
          <p>Empat faktor utama yang mendorong peningkatan suhu global pada periode terkini.</p>
        </header>

        <section className="detail-grid" aria-label="Daftar penyebab tren 2025">
          {driverItems.map((item) => (
            <article key={item.title} className="detail-card">
              <div className="detail-badge-row">
                <span className="detail-icon">{item.icon}</span>
                <span className="detail-badge">{item.badge}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p className="detail-muted">{item.detail}</p>
            </article>
          ))}
        </section>

        <Link to="/analisis" className="detail-back-link">Kembali ke halaman Analisis</Link>
      </main>
    </div>
  );
}

export default AnalisisPenyebab;
