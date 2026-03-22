import Navbar from "../components/Navbar/Navbar";
import MapView from "../components/Map/MapView";
import type { RegionPinDetail } from "../components/Map/MapLayer";
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

function Map() {
  const [selectedPin, setSelectedPin] = useState<RegionPinDetail | null>(null);
  const hasDetail = selectedPin !== null;

  const detailRows = useMemo(() => {
    if (!selectedPin) {
      return [];
    }

    return [
      {
        label: "Koordinat",
        value: `${selectedPin.lat.toFixed(4)}, ${selectedPin.lon.toFixed(4)}`,
      },
      {
        label: "Suhu",
        value: formatNullableNumber(selectedPin.temp, " C"),
      },
      {
        label: "AQI (OWM 1-5)",
        value: selectedPin.aqi == null ? "N/A" : selectedPin.aqi.toString(),
      },
      {
        label: "PM2.5",
        value: selectedPin.pm25 == null ? "N/A" : `${selectedPin.pm25.toFixed(2)} ug/m3`,
      },
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
        <section className={`map-layout ${hasDetail ? "has-detail" : ""}`}>
          <section className="map-card">
            <MapView onSelectPin={setSelectedPin} />
          </section>

          {selectedPin && (
            <aside className="map-detail-card" aria-live="polite">
              <div className="detail-topbar">
                <h2>Detail Lokasi</h2>
                <button
                  type="button"
                  className="detail-close-btn"
                  onClick={() => setSelectedPin(null)}
                >
                  Tutup
                </button>
              </div>

              <>
                <div className="detail-head">
                  <h3>{selectedPin.name}</h3>
                  <p>{selectedPin.province}</p>
                  <span className={`air-badge ${getAirBadgeClass(selectedPin.aqi)}`}>
                    {getAirText(selectedPin.aqi)}
                  </span>
                </div>

                <div className="detail-grid">
                  {detailRows.map((item) => (
                    <article key={item.label} className="detail-item">
                      <p>{item.label}</p>
                      <h4>{item.value}</h4>
                    </article>
                  ))}
                </div>
              </>
            </aside>
          )}
        </section>
      </main>
    </div>
  );
}

export default Map;