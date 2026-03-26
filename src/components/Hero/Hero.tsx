import "./Hero.css";
import Icon from "../../assets/icon.png";

function Hero() {
  return (
    <section className="hero">
      <img src={Icon} alt="Ikon Urban Heat Island Tracking" className="hero-icon" />
      <h1>Urban Heat Island Tracking</h1>

      <p>
        Monitor urban heat islands, explore temperature patterns,
        and simulate green solutions to build cooler cities.
      </p>

      <button>Explore Heat Map</button>
    </section>
  );
}

export default Hero;