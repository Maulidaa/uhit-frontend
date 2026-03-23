import {
	FaArrowRight,
	FaEnvelope,
	FaGithub,
	FaInstagram,
	FaMapMarkedAlt,
} from "react-icons/fa";
import "./footer.css";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="site-footer" aria-labelledby="footer-title">
			<div className="footer-container">
				<div className="footer-brand">
					<span className="footer-eyebrow">Urban Climate Intelligence</span>
					<h2 id="footer-title">U-HIT</h2>
					<p>
						Urban Heat Island Tracking untuk eksplorasi suhu perkotaan,
						kualitas udara, dan solusi kota hijau berbasis data.
					</p>
					<a className="footer-cta" href="/simulator">
						Coba Simulator <FaArrowRight aria-hidden="true" />
					</a>
				</div>

				<nav className="footer-links" aria-label="Footer navigation">
					<h3>Navigasi</h3>
					<ul>
						<li>
							<a href="/">Home</a>
						</li>
						<li>
							<a href="/map">Map</a>
						</li>
						<li>
							<a href="/simulator">Simulation</a>
						</li>
					</ul>
				</nav>

				<nav className="footer-links" aria-label="Footer features">
					<h3>Fitur</h3>
					<ul>
						<li>
							<a href="/map">Heatmap Interaktif</a>
						</li>
						<li>
							<a href="/simulator">Simulasi UHI</a>
						</li>
						<li>
							<a href="/map">Data Lingkungan</a>
						</li>
					</ul>
				</nav>

				<div className="footer-contact">
					<h3>Kontak</h3>
					<p>
						<FaMapMarkedAlt aria-hidden="true" /> Indonesia
					</p>
					<p>
						<FaEnvelope aria-hidden="true" /> support@uhit.local
					</p>
					<div className="footer-social">
						<a href="#" aria-label="Instagram">
							<FaInstagram />
						</a>
						<a href="#" aria-label="GitHub">
							<FaGithub />
						</a>
					</div>
					<span className="footer-status">Live data-ready dashboard</span>
				</div>
			</div>

			<div className="footer-bottom">
				<small>Copyright {year} U-HIT. All rights reserved.</small>
				<p>Made to help cities stay cooler.</p>
			</div>
		</footer>
	);
}
