import { useState } from "react";
import "./sulusi.css";
import materialReflektifImage from "../../assets/solusi/matrialReflektif.png";
import menanamPohonImage from "../../assets/solusi/menanamPohon.png";
import transportasiUmumImage from "../../assets/solusi/transportasiUmum.png";

const solutions = [
    {
        image: menanamPohonImage,
        imageAlt: "Menanam pohon sebagai solusi penghijauan kota",
        title: "Penanaman Pohon dan Ruang Hijau",
        description:
            "Menambah area hijau di perkotaan membantu menurunkan suhu melalui proses evapotranspirasi.",
    },
    {
        image: materialReflektifImage,
        imageAlt: "Bangunan modern sebagai ilustrasi penggunaan material reflektif",
        title: "Penggunaan Material Reflektif",
        description:
            "Material bangunan yang memantulkan sinar matahari dapat mengurangi penyerapan panas permukaan.",
    },
    {
        image: transportasiUmumImage,
        imageAlt: "Transportasi umum sebagai solusi mobilitas ramah lingkungan",
        title: "Transportasi Ramah Lingkungan",
        description:
            "Mengurangi kendaraan pribadi dan mendorong transportasi umum menekan emisi panas perkotaan.",
    },
];

export default function Sulusi() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="solusi-section" aria-labelledby="solusi-heading">
            <div className="solusi-container">
                <header className="solusi-header">
                    <p className="solusi-eyebrow">Aksi Mitigasi</p>
                    <h2 id="solusi-heading">Solusi untuk Mengatasi UHI</h2>
                    <p>
                        Dengan langkah yang tepat, kota bisa menjadi lebih sejuk, sehat, dan
                        nyaman untuk dihuni.
                    </p>
                </header>

                <div className="solusi-grid">
                    {solutions.map((item, index) => {
                        return (
                            <button
                                key={item.title}
                                type="button"
                                className={`solusi-card ${activeIndex === index ? "is-flipped" : ""}`}
                                aria-pressed={activeIndex === index}
                                onClick={() =>
                                    setActiveIndex((prev) => (prev === index ? null : index))
                                }
                            >
                                <div className="solusi-card-inner">
                                    <div className="solusi-face solusi-front">
                                        <div className="solusi-image-wrap">
                                            <img src={item.image} alt={item.imageAlt} loading="lazy" />
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p className="solusi-hint">Hover atau klik untuk detail</p>
                                    </div>
                                    <div className="solusi-face solusi-back">
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <p className="solusi-closing">
                    Kombinasi strategi ini dapat mengurangi dampak Urban Heat Island dan
                    menciptakan lingkungan perkotaan yang lebih berkelanjutan.
                </p>
            </div>
        </section>
    );
}