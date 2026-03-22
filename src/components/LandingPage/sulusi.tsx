import { FaBus, FaBuilding, FaLeaf, FaPaintRoller } from "react-icons/fa";
import "./sulusi.css";

const solutions = [
    {
        icon: FaLeaf,
        title: "Penanaman Pohon dan Ruang Hijau",
        description:
            "Menambah area hijau di perkotaan membantu menurunkan suhu melalui proses evapotranspirasi.",
    },
    {
        icon: FaPaintRoller,
        title: "Penggunaan Material Reflektif",
        description:
            "Material bangunan yang memantulkan sinar matahari dapat mengurangi penyerapan panas permukaan.",
    },
    {
        icon: FaBuilding,
        title: "Atap Hijau",
        description:
            "Penerapan atap hijau membantu menyerap panas sekaligus meningkatkan isolasi termal bangunan.",
    },
    {
        icon: FaBus,
        title: "Transportasi Ramah Lingkungan",
        description:
            "Mengurangi kendaraan pribadi dan mendorong transportasi umum menekan emisi panas perkotaan.",
    },
];

export default function Sulusi() {
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
                    {solutions.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article key={item.title} className="solusi-card">
                                <div className="solusi-icon" aria-hidden="true">
                                    <Icon />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </article>
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