import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">

        <div className="logo">
          U-HIT
        </div>

        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/map">Map</Link></li>
          <li>Analysis</li>
          <li><Link to="/simulator">Simulation</Link></li>
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;