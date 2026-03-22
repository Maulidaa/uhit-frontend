import { FaEnvelope, FaGithub, FaInstagram, FaMapMarkedAlt } from "react-icons/fa";
import "./footer.css";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="site-footer" aria-labelledby="footer-title">
			<div className="footer-container">
				<div className="footer-brand">
					<h2 id="footer-title">U-HIT</h2>
					<p>
						Urban Heat Island Tracking untuk eksplorasi suhu perkotaan,
						kualitas udara, dan solusi kota hijau berbasis data.
					</p>
				</div>

				<nav className="footer-links" aria-label="Footer navigation">
					<h3>Jelajahi</h3>
					<a href="/">Home</a>
					<a href="/map">Map</a>
					<a href="/simulator">Simulation</a>
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
				</div>
			</div>

			<div className="footer-bottom">
				<small>Copyright {year} U-HIT. All rights reserved.</small>
			</div>
		</footer>
	);
}
