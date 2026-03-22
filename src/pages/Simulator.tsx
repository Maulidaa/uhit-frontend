import Navbar from "../components/Navbar/Navbar";
import SimulatorComponent from "../components/Simulator/Simulator";
import "./Simulator.css";

function Simulator() {
  return (
    <div className="sim-page">
      <Navbar />
      <main className="sim-content">
        <div className="sim-card">
          <SimulatorComponent />
        </div>
      </main>
    </div>
  );
}

export default Simulator;
