import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-top-row">
          <div className="logo">U-HIT</div>

          <button
            type="button"
            className={`nav-toggle ${isMobileMenuOpen ? "open" : ""}`}
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <ul
          id="main-navigation"
          className={`nav-menu ${isMobileMenuOpen ? "open" : ""}`}
        >
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/map" onClick={closeMenu}>Map</Link>
          </li>
          <li>
            <Link to="/analisis" onClick={closeMenu}>Analysis</Link>
          </li>
          <li>
            <Link to="/simulator" onClick={closeMenu}>Simulation</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;