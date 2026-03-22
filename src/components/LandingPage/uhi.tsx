import "./uhi.css";
import uhiImage from "../../assets/uhi.png";
import uhiImageAlt from "../../assets/uhi2.png";

export default function Uhi() {
    return (
        <section className="uhi-section" aria-labelledby="uhi-heading">
            <div className="uhi-container">
                <header className="uhi-header">
                    <p className="uhi-eyebrow">Pengenalan</p>
                    <h2 id="uhi-heading">Apa Itu Urban Heat Island (UHI)?</h2>
                </header>

                <div className="uhi-layout">
                    <div className="uhi-visual-stack" aria-hidden="true">
                        <figure className="uhi-visual uhi-visual-main">
                            <img src={uhiImage} alt="Kawasan perkotaan padat dengan suhu tinggi" />
                        </figure>
                        <figure className="uhi-visual uhi-visual-accent">
                            <img src={uhiImageAlt} alt="Jalan layang perkotaan di malam hari" />
                        </figure>
                    </div>

                    <article className="uhi-content">
                        <p>
                            Urban Heat Island (UHI) adalah fenomena ketika suhu area perkotaan
                            lebih tinggi dibanding wilayah sekitarnya yang lebih alami.
                        </p>
                        <h3>Faktor Utama Penyebab UHI</h3>
                        <ul className="uhi-factor-grid">
                            <li>Pembangunan infrastruktur mengurangi area hijau</li>
                            <li>Penggunaan kendaraan bermotor menghasilkan panas tambahan</li>
                            <li>Material bangunan menyerap dan memantulkan panas</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>
    );
}