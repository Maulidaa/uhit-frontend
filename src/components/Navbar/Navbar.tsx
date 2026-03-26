import { useState } from "react";
import { NavLink } from "react-router-dom";
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
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/map"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={closeMenu}
            >
              Map
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analisis"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={closeMenu}
            >
              Analysis
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/simulator"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={closeMenu}
            >
              Simulation
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;