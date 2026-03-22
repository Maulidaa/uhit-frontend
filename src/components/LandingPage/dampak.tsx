import "./dampak.css";
import { FaCloudRain, FaHeartbeat, FaLightbulb } from "react-icons/fa";

const impactItems = [
    {
        icon: FaHeartbeat,
        title: "Kesehatan Masyarakat",
        description:
            "Suhu tinggi meningkatkan risiko heat stroke, dehidrasi, dan memperburuk asma serta penyakit jantung.",
    },
    {
        icon: FaLightbulb,
        title: "Konsumsi Energi",
        description:
            "Kebutuhan pendinginan meningkat di musim panas sehingga konsumsi energi dan biaya listrik ikut naik.",
    },
    {
        icon: FaCloudRain,
        title: "Pola Cuaca Lokal",
        description:
            "UHI memengaruhi sirkulasi angin dan curah hujan yang berpotensi mengubah iklim mikro kawasan kota.",
    },
];

export default function Dampak() {
    return (
        <section className="dampak-section" aria-labelledby="dampak-heading">
            <div className="dampak-container">
                <header className="dampak-header">
                    <p className="dampak-eyebrow">Konsekuensi</p>
                    <h2 id="dampak-heading">Dampak Urban Heat Island</h2>
                    <p className="dampak-intro">
                        Urban Heat Island (UHI) berdampak langsung pada kualitas hidup warga
                        kota melalui kesehatan, konsumsi energi, dan perubahan cuaca lokal.
                    </p>
                </header>

                <div className="dampak-grid">
                    {impactItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article key={item.title} className="dampak-card">
                                <div className="dampak-icon-wrap" aria-hidden="true">
                                    <Icon />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}