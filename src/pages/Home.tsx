import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import UIHT from "../components/LandingPage/uhi";
import Dampak from "../components/LandingPage/dampak";
import Sulusi from "../components/LandingPage/sulusi";
import Footer from "../components/Footer/footer";
import { useEffect } from "react";
import "./Home.css";

function Home() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".home-page .uhi-section, .home-page .dampak-section, .home-page .solusi-section, .home-page .site-footer",
      ),
    );

    if (targets.length === 0) {
      return;
    }

    targets.forEach((section) => section.classList.add("reveal-section"));

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      targets.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    targets.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <UIHT />
      <Dampak />
      <Sulusi />
      <Footer />
    </div>
  );
}

export default Home;