import Navbar from "../components/Navbar/Navbar";
import MapView from "../components/Map/MapView";
import type { RegionPinDetail } from "../components/Map/MapLayer";
import { FaTimes } from "react-icons/fa";
import { useMemo, useState } from "react";
import "./Map.css";

function formatNullableNumber(value: number | null, suffix = "") {
  if (value == null) {
    return "N/A";
  }
  return `${value.toFixed(1)}${suffix}`;
}

function getAirBadgeClass(aqi: number | null) {
  if (aqi == null) {
    return "air-na";
  }
  if (aqi <= 2) {
    return "air-good";
  }
  if (aqi <= 3) {
    return "air-medium";
  }
  return "air-bad";
}

function getAirText(aqi: number | null) {
  if (aqi == null) {
    return "Data AQI belum tersedia";
  }
  if (aqi <= 2) {
    return "Kualitas udara cenderung baik";
  }
  if (aqi <= 3) {
    return "Kualitas udara sedang";
  }
  return "Kualitas udara kurang baik";
}

function buildLocationInsight(pin: RegionPinDetail) {
  const temp = pin.temp;
  const green = pin.greenPercent;

  if (temp == null && green == null) {
    return "Data lingkungan masih terbatas untuk lokasi ini. Silakan cek wilayah terdekat.";
  }

  if (temp != null && temp >= 32 && (green == null || green < 20)) {
    return "Suhu cukup tinggi dengan tutupan hijau rendah. Prioritaskan penanaman pohon dan koridor teduh.";
  }

  if (temp != null && temp >= 30) {
    return "Area ini cenderung panas pada pengukuran saat ini. Intervensi ruang terbuka dan material reflektif bisa membantu.";
  }

  if (green != null && green >= 30) {
    return "Tutupan hijau relatif baik, membantu menahan kenaikan suhu permukaan di area ini.";
  }

  return "Kondisi lokasi berada pada tingkat sedang. Pantau tren suhu dan kualitas udara secara berkala.";
}

function Map() {
  const [selectedPin, setSelectedPin] = useState<RegionPinDetail | null>(null);
  const hasDetail = selectedPin !== null;

  const insightText = useMemo(() => {
    if (!selectedPin) {
      return "";
    }
    return buildLocationInsight(selectedPin);
  }, [selectedPin]);

  const quickStats = useMemo(() => {
    if (!selectedPin) {
      return [];
    }

    return [
      {
        label: "Suhu",
        value: formatNullableNumber(selectedPin.temp, " C"),
      },
      {
        label: "AQI",
        value: selectedPin.aqi == null ? "N/A" : selectedPin.aqi.toString(),
      },
      {
        label: "PM2.5",
        value: selectedPin.pm25 == null ? "N/A" : `${selectedPin.pm25.toFixed(1)} ug/m3`,
      },
    ];
  }, [selectedPin]);

  const detailRows = useMemo(() => {
    if (!selectedPin) {
      return [];
    }

    return [
      {
        label: "Populasi",
        value:
          selectedPin.population == null
            ? "N/A"
            : selectedPin.population.toLocaleString("id-ID"),
      },
      {
        label: "Wilayah Hijau",
        value:
          selectedPin.greenPercent == null
            ? "N/A"
            : `${selectedPin.greenPercent.toFixed(1)}% (${selectedPin.greenStatus ?? "N/A"})`,
      },
    ];
  }, [selectedPin]);

  return (
    <div className="map-page">
      <Navbar />
      <main className="map-content">
        <section className="map-hero" aria-label="Map overview">
          <div className="map-hero-main">
            <span className="map-hero-kicker">Urban Heat Explorer</span>
            <h1>Petakan suhu dan kualitas udara secara interaktif</h1>
            <p>Zoom untuk lebih detail, klik marker untuk detail suhu, AQI, populasi, dan wilayah hijau.</p>
          </div>
        </section>

        <section className={`map-layout ${hasDetail ? "has-detail" : ""}`}>
          <section className="map-card">
            <div className="map-legend" aria-hidden="true">
              <span className="legend-title">Legenda Suhu</span>
              <span className="legend-chip legend-low">Rendah</span>
              <span className="legend-chip legend-medium">Sedang</span>
              <span className="legend-chip legend-high">Tinggi</span>
            </div>
            <MapView onSelectPin={setSelectedPin} />
          </section>

          {selectedPin && (
            <aside className="map-detail-card" aria-live="polite">
              <div className="detail-topbar">
                <h2>Detail Lokasi</h2>
                <button
                  type="button"
                  className="detail-close-btn"
                  aria-label="Tutup detail lokasi"
                  onClick={() => setSelectedPin(null)}
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </div>

              <div className="detail-body">
                <div className="detail-head">
                  <div className="detail-header-band">
                    {/* <div>
                      <span className="detail-chip">Selected Location</span>
                      <h3>{selectedPin.name}</h3>
                      <p>{selectedPin.province}</p>
                    </div>
                    {/* <div className="detail-temp-pill" aria-label="Suhu utama lokasi">
                      {formatNullableNumber(selectedPin.temp, " C")}
                    </div> */}
                  </div>

                  <div className="detail-tags">
                    <span className={`air-badge ${getAirBadgeClass(selectedPin.aqi)}`}>
                      {getAirText(selectedPin.aqi)}
                    </span>
                  </div>

                  <p className="detail-section-title">Ringkasan Cepat</p>
                  <div className="detail-quick-stats">
                    {quickStats.map((item) => (
                      <article
                        key={item.label}
                        className={`quick-stat-item stat-${item.label.toLowerCase().replace(".", "").replace(" ", "-")}`}
                      >
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </article>
                    ))}
                  </div>

                  <p className="detail-insight">{insightText}</p>
                </div>

                <p className="detail-section-title">Data Wilayah</p>
                <div className="detail-grid">
                  {detailRows.map((item) => (
                    <article key={item.label} className="detail-item">
                      <p>{item.label}</p>
                      <h4>{item.value}</h4>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </section>
      </main>
    </div>
  );
}

export default Map;