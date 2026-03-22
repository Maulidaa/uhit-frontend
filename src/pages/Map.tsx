import Navbar from "../components/Navbar/Navbar";
import MapView from "../components/Map/MapView";
import "./Map.css";

function Map() {
  return (
    <div className="map-page">
      <Navbar />
      <main className="map-content">
        <section className="map-card">
          <MapView />
        </section>
      </main>
    </div>
  );
}

export default Map;