import Navbar from "../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import kenaikanSuhuImage from "../assets/analisis/kenaikan suhu.png";
import "./Analisis.css";

type HeroNewsItem = {
  label: string;
  title: string;
  description: string;
  to?: string;
  href?: string;
};

const heroNewsLinks: HeroNewsItem[] = [
  {
    to: "/analisis/grafik",
    label: "Data Global",
    title: "Grafik Tren Suhu",
    description: "Anomali suhu 1880-2025 dan pola pemanasan terbaru.",
  },
  {
    to: "/analisis/penyebab",
    label: "Pendorong Utama",
    title: "Penyebab Tren 2025",
    description: "Gas rumah kaca, El Nino, dan pola laut-atmosfer.",
  },
  {
    to: "/analisis/relevansi",
    label: "Dampak Nasional",
    title: "Relevansi untuk Indonesia",
    description: "Risiko panas perkotaan, kesehatan, dan adaptasi lokal.",
  },
  {
    href: "https://www.americanforests.org/article/what-is-the-urban-heat-island-effect/",
    label: "Sumber UHI",
    title: "Urban Heat Island",
    description: "Kawasan urban rata-rata 5-7 derajat lebih panas di siang hari dan bisa jauh lebih panas pada malam hari.",
  },
];

function Analisis() {
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const totalCards = heroNewsLinks.length;

  const handlePrevNews = () => {
    setActiveNewsIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleNextNews = () => {
    setActiveNewsIndex((prev) => (prev + 1) % totalCards);
  };

  const visibleCards = [
    (activeNewsIndex - 1 + totalCards) % totalCards,
    activeNewsIndex,
    (activeNewsIndex + 1) % totalCards,
  ].map((itemIndex, slot) => ({
    item: heroNewsLinks[itemIndex],
    itemIndex,
    slot,
  }));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % totalCards);
    }, 14200);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="analisis-page">
      <Navbar />
      <main className="analisis-content">
        <section
          className="analisis-hero"
          aria-label="Ringkasan tren suhu global"
          style={{ backgroundImage: `url(${kenaikanSuhuImage})` }}
        >
          <div className="hero-scrim" />
          <div className="hero-content">
            <span className="analisis-kicker">Climate Signal</span>
            <h1>Tren Kenaikan Suhu Global 2025</h1>
            <p>
              Tahun 2025 berpotensi menjadi tahun terpanas kedua atau ketiga dalam catatan sejarah.
              Suhu rata-rata permukaan bumi Januari-Agustus 2025 mencapai +1,42 C ± 0,12 C di
              atas rata-rata pra-industri (1850-1900).
            </p>
            <div className="hero-news-controls" aria-label="Navigasi ringkasan berita">
              <button
                type="button"
                className="hero-news-arrow"
                aria-label="Lihat kartu sebelumnya"
                onClick={handlePrevNews}
              >
                <span className="hero-news-arrow-icon hero-news-arrow-icon--left" aria-hidden="true" />
              </button>
              <div className="hero-news-row">
                {visibleCards.map(({ item, itemIndex, slot }) => (
                  item.href ? (
                    <a
                      key={`${item.href}-${slot}`}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hero-news-card ${slot === 1 ? "is-active hero-news-card--center" : "hero-news-card--side"}`}
                      onMouseEnter={() => setActiveNewsIndex(itemIndex)}
                      onFocus={() => setActiveNewsIndex(itemIndex)}
                    >
                      <small>{item.label}</small>
                      <strong>{item.title}</strong>
                      <span className="hero-news-desc">{item.description}</span>
                    </a>
                  ) : (
                    <Link
                      key={`${item.to}-${slot}`}
                      to={item.to ?? "/analisis"}
                      className={`hero-news-card ${slot === 1 ? "is-active hero-news-card--center" : "hero-news-card--side"}`}
                      onMouseEnter={() => setActiveNewsIndex(itemIndex)}
                      onFocus={() => setActiveNewsIndex(itemIndex)}
                    >
                      <small>{item.label}</small>
                      <strong>{item.title}</strong>
                      <span className="hero-news-desc">{item.description}</span>
                    </Link>
                  )
                ))}
              </div>
              <button
                type="button"
                className="hero-news-arrow"
                aria-label="Lihat kartu berikutnya"
                onClick={handleNextNews}
              >
                <span className="hero-news-arrow-icon hero-news-arrow-icon--right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Analisis;
