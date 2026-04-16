import "./About.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  const [showScrollUpButton, setShowScrollUpButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".fade").forEach((el) => observer.observe(el));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUpButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="about-page">

      {/* HERO */}
      <section className="hero fade">
        <h1>AR Webstore</h1>
        <p>
          Experience a new way of shopping with immersive augmented reality.
        </p>
      </section>

      {/* ABOUT */}
      <section className="section fade">
        <h2>About the Project</h2>
        <p>
          AR Webstore is designed to enhance online shopping by allowing users
          to visualize products in real-world environments. It bridges the gap
          between physical and digital shopping experiences.
        </p>
      </section>

      {/* FEATURES */}
      <section className="section fade">
        <h2>Features</h2>
        <ul>
          <li>360° Product Visualization</li>
          <li>Augmented Reality Placement</li>
          <li>Interactive Product Exploration</li>
          <li>Realistic 3D Models</li>
        </ul>
      </section>

      {/* TECH */}
      <section className="section fade">
        <h2>Technology</h2>
        <p>
          Built using modern web technologies for immersive experiences and smooth performance.
        </p>
      </section>

      {/* TEAM */}
      <section className="section fade">
        <h2>Our Team</h2>

        <div className="team">

          <div className="card">
            <img src="https://via.placeholder.com/150" alt="" />
            <h3>Team Member</h3>
            <p>Frontend Development</p>
          </div>

          <div className="card">
            <img src="https://via.placeholder.com/150" alt="" />
            <h3>Team Member</h3>
            <p>Backend Development</p>
          </div>

          <div className="card">
            <img src="https://via.placeholder.com/150" alt="" />
            <h3>Team Member</h3>
            <p>AR / 3D Design</p>
          </div>

          <div className="card">
            <img src="https://via.placeholder.com/150" alt="" />
            <h3>Team Member</h3>
            <p>UI/UX Design</p>
          </div>

        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="section fade">
        <p>Built as a collaborative project to explore immersive web technologies.</p>
      </section>

      {/* SCROLL BUTTON */}
      {showScrollUpButton && (
        <button className="scroll-btn" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}

    </div>
  );
};

export default About;