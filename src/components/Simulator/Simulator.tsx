import { type DragEvent, useMemo, useState } from "react";
import { FaCarSide, FaTree } from "react-icons/fa";
import Result from "./Result";

type AirStatus = "Baik" | "Sedang" | "Buruk";
type TileType = "empty" | "forest" | "vehicle";

const GRID_SIZE = 20;

function getAirStatus(aqi: number): AirStatus {
  if (aqi <= 50) {
    return "Baik";
  }
  if (aqi <= 100) {
    return "Sedang";
  }
  return "Buruk";
}

export default function Simulator() {
  const [activeTool, setActiveTool] = useState<"forest" | "vehicle">("forest");
  const [tiles, setTiles] = useState<TileType[]>(() =>
    Array.from({ length: GRID_SIZE }, () => "empty"),
  );
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [lastPlacedIndex, setLastPlacedIndex] = useState<number | null>(null);

  const forestCount = useMemo(
    () => tiles.filter((tile) => tile === "forest").length,
    [tiles],
  );
  const vehicleCount = useMemo(
    () => tiles.filter((tile) => tile === "vehicle").length,
    [tiles],
  );

  const co2 = useMemo(() => {
    const value = vehicleCount * 0.6 - forestCount * 0.45;
    return Math.max(value, 0);
  }, [forestCount, vehicleCount]);

  const aqi = useMemo(() => Math.min(co2 * 18, 300), [co2]);
  const status = getAirStatus(aqi);
  const occupiedCount = forestCount + vehicleCount;
  const greenRatio = occupiedCount === 0 ? 0 : (forestCount / occupiedCount) * 100;

  const placeTile = (index: number, tileType: "forest" | "vehicle") => {
    setTiles((prevTiles) => {
      const nextTiles = [...prevTiles];
      nextTiles[index] = tileType;
      return nextTiles;
    });
    setLastPlacedIndex(index);
  };

  const removeTile = (index: number) => {
    setTiles((prevTiles) => {
      const nextTiles = [...prevTiles];
      nextTiles[index] = "empty";
      return nextTiles;
    });
  };

  const onDropTile = (index: number, event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragOverIndex(null);
    const droppedType = event.dataTransfer.getData("text/plain");

    if (droppedType === "forest" || droppedType === "vehicle") {
      placeTile(index, droppedType);
    }
  };

  const onDragStartTool = (
    type: "forest" | "vehicle",
    event: DragEvent<HTMLButtonElement>,
  ) => {
    event.dataTransfer.setData("text/plain", type);
  };

  const resetBoard = () => {
    setTiles(Array.from({ length: GRID_SIZE }, () => "empty"));
    setLastPlacedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <section className="simulator-panel">
      <h1>Simulasi UHI</h1>
      <p className="simulator-subtitle">
        Drag item ke area kota seperti game strategi. Semakin banyak kendaraan,
        emisi naik. Semakin banyak hutan, emisi turun.
      </p>

      <div className="sim-workspace">
        <div className="sim-editor">
          <div className="simulator-toolbar" role="group" aria-label="Palette simulasi">
            <button
              type="button"
              className={`tool-card ${activeTool === "forest" ? "active" : ""}`}
              draggable
              onDragStart={(event) => onDragStartTool("forest", event)}
              onClick={() => setActiveTool("forest")}
            >
              <FaTree aria-hidden="true" />
              <span>Hutan</span>
            </button>

            <button
              type="button"
              className={`tool-card ${activeTool === "vehicle" ? "active" : ""}`}
              draggable
              onDragStart={(event) => onDragStartTool("vehicle", event)}
              onClick={() => setActiveTool("vehicle")}
            >
              <FaCarSide aria-hidden="true" />
              <span>Kendaraan</span>
            </button>
          </div>

          <div className="simulator-meta">
            <p>Hutan ditempatkan: {forestCount}</p>
            <p>Kendaraan ditempatkan: {vehicleCount}</p>
            <p>Kepadatan: {occupiedCount}/{GRID_SIZE}</p>
            <button type="button" className="reset-btn" onClick={resetBoard}>
              Reset Peta
            </button>
          </div>

          <section className="city-balance" aria-label="Keseimbangan ekosistem kota">
            <header>
              <h3>Indeks Kota Hijau</h3>
              <span>{greenRatio.toFixed(0)}%</span>
            </header>
            <div className="balance-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number(greenRatio.toFixed(0))}>
              <div className="balance-fill" style={{ width: `${greenRatio}%` }} />
            </div>
            <p>
              Target ideal minimal 60% area hijau agar kualitas udara tetap stabil.
            </p>
          </section>

          <div className="sim-grid" aria-label="Grid area simulasi kota">
            {tiles.map((tile, index) => (
              <button
                key={index}
                type="button"
                className={`sim-cell ${tile !== "empty" ? `tile-${tile}` : ""} ${dragOverIndex === index ? "is-drag-over" : ""} ${lastPlacedIndex === index ? "is-fresh" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverIndex(index);
                }}
                onDragLeave={() =>
                  setDragOverIndex((prev) => (prev === index ? null : prev))
                }
                onDrop={(event) => onDropTile(index, event)}
                onClick={() => {
                  if (tile === "empty") {
                    placeTile(index, activeTool);
                    return;
                  }
                  removeTile(index);
                }}
                title={tile === "empty" ? "Klik atau drop item" : "Klik untuk hapus"}
              >
                {tile === "forest" && <FaTree aria-label="Hutan" />}
                {tile === "vehicle" && <FaCarSide aria-label="Kendaraan" />}
              </button>
            ))}
          </div>
        </div>

        <Result
          co2={co2}
          aqi={aqi}
          status={status}
          forestCount={forestCount}
          vehicleCount={vehicleCount}
        />
      </div>
    </section>
  );
}
