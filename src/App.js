import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import "./styles/project-cards.css";
import personalData from "./config/personalData";
import experienceData from "./config/experienceData";
import skillsData from "./config/skillsData";
import projectsData from "./config/projectsData";
import educationData from "./config/educationData";
import { t } from "./i18n";

// Custom hooks
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}

function useLanguage() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "fr");
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("lang", lang);
  }, [lang]);
  const toggle = () => setLang((l) => (l === "fr" ? "en" : "fr"));
  return { lang, setLang, toggle };
}

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrollHeader() {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    const handleScroll = () => {
      if (window.scrollY > 100) {
        header?.classList.add("scrolled");
      } else {
        header?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

function useTypewriter(text, speed = 100) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
}

// Components
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const startCount = 0;
    const endCount = end;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(
        progress * (endCount - startCount) + startCount
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function Modal({ isOpen, onClose, title, description, tags, images, details }) {
  const [index, setIndex] = useState(0);
  const hasImages = images && images.length > 0;

  useEffect(() => {
    if (!isOpen) setIndex(0);
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog">
        <button className="modal__close" aria-label="Fermer" onClick={onClose}>
          ×
        </button>
        <div className="modal__content">
          <h3 className="modal__title">{title}</h3>
          <p className="modal__desc">{description}</p>
          {details && (
            <div className="modal__details">
              <h4>Détails du projet</h4>
              <ul>
                {details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="modal__tags">
            {(tags || []).map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          {hasImages && (
            <div className="modal__gallery">
              <button
                className="gallery__nav prev"
                aria-label="Précédent"
                onClick={() =>
                  setIndex((i) => (i - 1 + images.length) % images.length)
                }
              >
                ‹
              </button>
              <div className="gallery__viewport">
                <img src={images[index]} alt={title} />
              </div>
              <button
                className="gallery__nav next"
                aria-label="Suivant"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { lang } = useLanguage();

  const contactL = {
    formTitle: t(lang, "contact.formTitle"),
    formSubtitle: t(lang, "contact.formSubtitle"),
    name: t(lang, "contact.name"),
    email: t(lang, "contact.email"),
    message: t(lang, "contact.message"),
    placeholderName: t(lang, "contact.placeholderName"),
    placeholderEmail: t(lang, "contact.placeholderEmail"),
    placeholderMessage: t(lang, "contact.placeholderMessage"),
    submit: t(lang, "contact.submit"),
    sending: t(lang, "contact.sending"),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      formData.append("_subject", "Nouveau message du portfolio");
      formData.append("_captcha", "false");

      const response = await fetch(
        "https://formsubmit.co/ajax/fowengtcho@gmail.com",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Échec de l'envoi. Veuillez réessayer.");
      }

      const data = await response.json();
      if (data.success !== "true") {
        throw new Error("Une erreur est survenue lors de l'envoi.");
      }

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Impossible d'envoyer le message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="contact-success"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        <div className="success-icon">✓</div>
        <h3 style={{ color: "var(--success)", marginBottom: "1rem" }}>
          Message envoyé !
        </h3>
        <p>
          Merci pour votre message. Je vous répondrai dans les plus brefs
          délais.
        </p>
        <button
          className="btn btn--ghost"
          onClick={() => setIsSubmitted(false)}
          style={{ marginTop: "1rem" }}
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{contactL.formTitle}</h3>
        <p>{contactL.formSubtitle}</p>
      </div>
      {error && (
        <div
          className="glass"
          role="alert"
          style={{
            padding: "1rem",
            borderLeft: "4px solid var(--error)",
            color: "var(--text-primary)",
          }}
        >
          {error}
        </div>
      )}
      <div className="field">
        <label htmlFor="name">{contactL.name}</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder={contactL.placeholderName}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="email">{contactL.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder={contactL.placeholderEmail}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="message">{contactL.message}</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder={contactL.placeholderMessage}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button
        className="btn btn--primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? contactL.sending : contactL.submit}
      </button>
    </form>
  );
}

function ProjectSection() {
  const projects = [
    {
      id: 1,
      title: "SparkDjems",
      description: "Plateforme e-commerce et services logistiques",
      image: "https://hanniel.kouelab.com/images/assoh/assoh-1.jpg", // e-commerce
      status: "Terminé",
      category: "Full Stack",
      tags: ["Flutter", "Nest.JS", "MySQL", "+1"],
      demo: "https://sparkdjems.com",
      badge: "+6",
    },
    {
      id: 2,
      title: "OnBush",
      description: "Application de pedagogie",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.bNV0EO61QROb5oG-ogUP4gHaGI?rs=1&pid=ImgDetMain&o=7&rm=3", // education
      status: "En cours",
      category: "Mobile",
      tags: ["Flutter", "BLoC"],
      demo: "https://github.com/darrelx/OnBush",
      badge: "+3",
    },
    {
      id: 3,
      title: "VekTour",
      description: "Application de recherche de logements",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // housing
      status: "En cours",
      category: "Mobile",
      tags: ["Flutter", "BLoC"],
      demo: "https://github.com/darrelx/vektour",
      badge: "+3",
    },
    {
      id: 4,
      title: "Viaa",
      description: "Plateforme de convoiturage",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.xb2QPz0a-zkk-eacksPncgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3", // carpooling
      status: "Terminé",
      category: "Web",
      tags: ["React.Js"],
      demo: "https://car.viaa.cm",
      badge: "+1",
    },

    {
      id: 5,
      title: "VekTour",
      description: "Plateforme de recherche de logements",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.m1bSU5xUQlDzC9fpiIP71QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", // housing
      status: "Terminé",
      category: "Full Stack",
      demo: "https://vektour.com/",
      tags: ["React.JS"],
      badge: "+1",
    },
    {
      id: 6,
      title: "JVEPI",
      description: "Organistion communautaire",
      image:
        "https://legrandbassanews.com/wp-content/uploads/2024/10/unnamed-1-1024x682.jpg", // housing
      status: "Terminé",
      category: "Web",
      demo: "https://jvepi.com/",
      tags: ["React.JS", "Laravel"],
      badge: "+1",
    },
  ];

  const categories = [
    { label: "Tous", value: "Tous", count: projects.length },
    {
      label: "Web",
      value: "Web",
      count: projects.filter((p) => p.category === "Web").length,
    },
    {
      label: "Mobile",
      value: "Mobile",
      count: projects.filter((p) => p.category === "Mobile").length,
    },
    {
      label: "Full Stack",
      value: "Full Stack",
      count: projects.filter((p) => p.category === "Full Stack").length,
    },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState("Tous");
  const filteredProjects =
    selectedCategory === "Tous"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section>
      <div>
        <div className="project-filters">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`project-filter-btn${
                selectedCategory === cat.value ? " selected" : ""
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}{" "}
              <span style={{ fontWeight: 600, marginLeft: 4 }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
        <div className="project-cards">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <span className="project-status">{project.status}</span>
              <span className="project-badge">{project.badge}</span>
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
              <div className="project-title">
                {project.category === "Mobile" && <span>📱</span>}
                {project.category === "Web" && <span>🌐</span>}
                {project.category === "Full Stack" && <span>🖥️</span>}
                {project.title}
              </div>
              <div className="project-description">{project.description}</div>
              <div className="project-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-demo"
                >
                  Démo
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const { lang, setLang, toggle: toggleLang } = useLanguage();
  useReveal();
  useScrollHeader();

  // Data from configuration files
  const experience = useMemo(() => experienceData, []);
  const personalProjects = useMemo(() => projectsData, []);
  const skills = useMemo(() => skillsData, []);
  const stats = useMemo(() => personalData.stats, []);

  const [modal, setModal] = useState({ open: false, project: null });

  const openProject = (p) => setModal({ open: true, project: p });
  const closeProject = () => setModal({ open: false, project: null });

  const currentYear = new Date().getFullYear();

  const L = {
    nav: {
      home: t(lang, "nav.home"),
      about: t(lang, "nav.about"),
      skills: t(lang, "nav.skills"),
      exp: t(lang, "nav.exp"),
      projects: t(lang, "nav.projects"),
      contact: t(lang, "nav.contact"),
    },
    heroHello: t(lang, "hero.hello"),
    sections: {
      aboutTitle: t(lang, "sections.aboutTitle"),
      aboutSubtitle: t(lang, "sections.aboutSubtitle"),
      skillsTitle: t(lang, "sections.skillsTitle"),
      skillsSubtitle: t(lang, "sections.skillsSubtitle"),
      expTitle: t(lang, "sections.expTitle"),
      projectsTitle: t(lang, "sections.projectsTitle"),
      projectsSubtitle: t(lang, "sections.projectsSubtitle"),
      eduTitle: t(lang, "sections.eduTitle"),
      eduSubtitle: t(lang, "sections.eduSubtitle"),
      contactTitle: t(lang, "sections.contactTitle"),
      contactSubtitle: t(lang, "sections.contactSubtitle"),
    },
    contact: {
      formTitle: t(lang, "contact.formTitle"),
      formSubtitle: t(lang, "contact.formSubtitle"),
      name: t(lang, "contact.name"),
      email: t(lang, "contact.email"),
      message: t(lang, "contact.message"),
      placeholderName: t(lang, "contact.placeholderName"),
      placeholderEmail: t(lang, "contact.placeholderEmail"),
      placeholderMessage: t(lang, "contact.placeholderMessage"),
      submit: t(lang, "contact.submit"),
      sending: t(lang, "contact.sending"),
    },
  };

  // ...existing code...
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="site">
      {/* Animated Background */}
      <div className="animated-bg"></div>

      <header className="site-header">
        <div className="container">
          <div className="header-content">
            <a href="#accueil" className="logo" aria-label="Retour à l'accueil">
              <span>/*</span> {personalData.name.split(" ")[0]} <span>*/</span>
            </a>
            <nav className="nav">
              <button
                className={`nav__toggle${navOpen ? " active" : ""}`}
                aria-label="Menu"
                aria-expanded={navOpen}
                onClick={() => setNavOpen((open) => !open)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <ul className={`nav__list${navOpen ? " nav__list--open" : ""}`}>
                <li>
                  <a href="#accueil">{L.nav.home}</a>
                </li>
                <li>
                  <a href="#apropos">{L.nav.about}</a>
                </li>
                <li>
                  <a href="#competences">{L.nav.skills}</a>
                </li>
                <li>
                  <a href="#experience">{L.nav.exp}</a>
                </li>
                <li>
                  <a href="#projets">{L.nav.projects}</a>
                </li>
                <li>
                  <a href="#contact">{L.nav.contact}</a>
                </li>
              </ul>
              <select
                aria-label={
                  lang === "fr" ? "Changer de langue" : "Change language"
                }
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="theme-toggle"
                style={{ padding: "8px", borderRadius: 8 }}
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
              <button
                className="theme-toggle"
                aria-label="Basculer le thème"
                title="Thème"
                onClick={toggle}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm8-5a1 1 0 0 1 1 1h1a1 1 0 1 1 0 2h-1a1 1 0 1 1-2 0 1 1 0 0 1 1-1Zm-8 7a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM3 12a1 1 0 0 1 1-1H5a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm1.64-6.36a1 1 0 0 1 1.41 0l.71.7A1 1 0 0 1 6 7.1l-.7-.7a1 1 0 0 1 0-1.42ZM17.3 17.3a1 1 0 0 1 1.41 0l.71.7A1 1 0 0 1 18.7 20l-.7-.7a1 1 0 0 1 0-1.42ZM17.3 6.7a1 1 0 0 1 0-1.41l.7-.71a1 1 0 0 1 1.42 1.42L18.7 6.7A1 1 0 0 1 17.3 6.7ZM5.3 17.3A1 1 0 0 1 6.7 18.7l-.7.7A1 1 0 0 1 4.6 18l.7-.7Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main id="accueil" className="hero">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__intro reveal">
              <h1>
                <span className="eyebrow">{personalData.title}</span>
                {L.heroHello}{" "}
                <span className="gradient-text">{personalData.name}</span>
              </h1>
              <p className="lead">{personalData.bio}</p>
              <div className="cta">
                <a
                  className="btn btn--primary"
                  href={personalData.cta.primary.link}
                >
                  {personalData.cta.primary.text}
                </a>
                <a
                  className="btn btn--ghost"
                  href={personalData.cta.secondary.link}
                >
                  {personalData.cta.secondary.text}
                </a>
              </div>
              <div className="socials">
                <a
                  href={personalData.social.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="social"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.84 9.66.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.12-1.48-1.12-1.48-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07.9 1.58 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .85-.28 2.78 1.05.81-.23 1.68-.35 2.55-.35s1.74.12 2.55.35c1.93-1.33 2.78-1.05 2.78-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.81-4.57 5.07.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
                    />
                  </svg>
                </a>
                <a
                  href={personalData.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="social"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M20.45 20.45h-3.55v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7H9.32V9h3.41v1.56h.05c.47-.9 1.61-1.85 3.31-1.85 3.54 0 4.19 2.33 4.19 5.36v6.38ZM6.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM4.57 20.45h3.55V9H4.57v11.45Z"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="hero__visual reveal">
              <div className="blob">
                <img
                  src={personalData.profileImage}
                  alt={`Portrait de ${personalData.name}`}
                  loading="lazy"
                />
              </div>
              <div className="hero__badges">
                {personalData.badges.map((badge, index) => (
                  <span key={index} className="chip">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="section section--alt">
        <div className="container">
          <div className="stats-grid reveal">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card glass">
                <div className="stat-number">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apropos" className="section">
        <div className="container">
          <div className="section__head reveal">
            <h2>{L.sections.aboutTitle}</h2>
            <p>{L.sections.aboutSubtitle}</p>
          </div>
          <div className="about reveal">
            <div className="about__card glass">
              <h3>{personalData.about.mission.title}</h3>
              <p>{personalData.about.mission.content}</p>
            </div>
            <div className="about__card glass">
              <h3>{personalData.about.expertise.title}</h3>
              <p>{personalData.about.expertise.content}</p>
            </div>
            <div className="about__card glass">
              <h3>{personalData.about.vision.title}</h3>
              <p>{personalData.about.vision.content}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="competences" className="section section--alt">
        <div className="container">
          <div className="section__head reveal">
            <h2>{L.sections.skillsTitle}</h2>
            <p>{L.sections.skillsSubtitle}</p>
          </div>
          <div className="skills-grid reveal">
            {skills.map((skill, index) => (
              <div key={index} className="skill-card glass">
                <div className="skill-header">
                  <h4>{skill.name}</h4>
                  <span className="skill-category">{skill.category}</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-progress"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <div className="skill-level">{skill.level}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="section">
        <div className="container">
          <div className="section__head reveal">
            <h2>{L.sections.expTitle}</h2>
            <p>
              Douala, Cameroun — Tel: (+237) 6 57 59 08 08 —
              fowengtcho@gmail.com
            </p>
          </div>
          <div className="timeline reveal">
            {experience.map((exp, index) => (
              <div key={index} className="tl">
                <div className="tl__head">
                  <h3>
                    {exp.title} — {exp.company}
                  </h3>
                  <span className="tl__meta">
                    {exp.location} • {exp.period}
                  </span>
                </div>
                <div className="tl__body">
                  <p className="tl__project">{exp.project}</p>
                  <p className="tl__description">{exp.description}</p>
                  <ul>
                    {exp.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                  <div className="tl__tags">
                    {exp.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projets" className="section section--alt">
        {/* Section Projets interactive */}
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="section-title">Mes projets</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Une sélection de mes projets les plus significatifs, allant des
              applications mobiles aux plateformes web complètes
            </p>
          </div>
          {/* Filtres catégories */}
          <ProjectSection />
        </div>
      </section>

      <section id="education" className="section">
        <div className="container">
          <div className="section__head reveal">
            <h2>{L.sections.eduTitle}</h2>
            <p>{L.sections.eduSubtitle}</p>
          </div>
          <div className="about reveal">
            {educationData.map((edu, index) => (
              <div key={index} className="about__card glass">
                <h3>{edu.title}</h3>
                <p>
                  <strong>{edu.subtitle}</strong>
                  <br />
                  {edu.period}
                  <br />
                  {edu.institution}
                </p>
                <p className="education-description">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section section--alt">
        <div className="container">
          <div className="section__head reveal">
            <h2>{L.sections.contactTitle}</h2>
            <p>{L.sections.contactSubtitle}</p>
          </div>
          <div className="contact-container contact-container--responsive reveal">
            <div className="contact-form-container">
              <ContactForm />
            </div>
            <div className="contact-info">
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-content">
                    <h4>Email</h4>
                    <a href={`mailto:${personalData.contact.email}`}>
                      {personalData.contact.email}
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📱</div>
                  <div className="contact-content">
                    <h4>Téléphone</h4>
                    <a
                      href={`tel:${personalData.contact.phone.replace(
                        /\s/g,
                        ""
                      )}`}
                    >
                      {personalData.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-content">
                    <h4>Localisation</h4>
                    <p>{personalData.contact.location}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">💼</div>
                  <div className="contact-content">
                    <h4>Disponibilité</h4>
                    <p>Ouvert aux nouvelles opportunités</p>
                  </div>
                </div>
              </div>
              <div className="contact-social">
                <h4>Suivez-moi</h4>
                <div className="social-links">
                  <a
                    href={personalData.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.84 9.66.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.12-1.48-1.12-1.48-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07.9 1.58 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .85-.28 2.78 1.05.81-.23 1.68-.35 2.55-.35s1.74.12 2.55.35c1.93-1.33 2.78-1.05 2.78-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.81-4.57 5.07.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
                      />
                    </svg>
                    <span>GitHub</span>
                  </a>
                  <a
                    href={personalData.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        fill="currentColor"
                        d="M20.45 20.45h-3.55v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7H9.32V9h3.41v1.56h.05c.47-.9 1.61-1.85 3.31-1.85 3.54 0 4.19 2.33 4.19 5.36v6.38ZM6.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM4.57 20.45h3.55V9H4.57v11.45Z"
                      />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <p>
            © <span>{currentYear}</span> {personalData.name} — Tous droits
            réservés.
          </p>
        </div>
      </footer>

      <Modal
        isOpen={modal.open}
        onClose={closeProject}
        title={modal.project?.title}
        description={modal.project?.description}
        details={modal.project?.details}
        tags={modal.project?.tags}
        images={modal.project?.images}
      />
    </div>
  );
}
