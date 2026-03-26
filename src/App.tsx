import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Map from "./pages/Map.tsx";
import Analisis from "./pages/Analisis.tsx";
import AnalisisGrafik from "./pages/AnalisisGrafik.tsx";
import AnalisisPenyebab from "./pages/AnalisisPenyebab.tsx";
import AnalisisRelevansi from "./pages/AnalisisRelevansi.tsx";
import Simulator from "./pages/Simulator.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/analisis/grafik" element={<AnalisisGrafik />} />
        <Route path="/analisis/penyebab" element={<AnalisisPenyebab />} />
        <Route path="/analisis/relevansi" element={<AnalisisRelevansi />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;