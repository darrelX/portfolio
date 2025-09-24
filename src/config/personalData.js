// Configuration centralisée des données personnelles
// Modifiez ce fichier pour mettre à jour vos informations sans toucher au code source

export const personalData = {
  // Informations de base
  name: "Darrel FOWENG TCHO",
  title: "Développeur Full‑Stack",
  subtitle: "Ingénieur en systèmes intelligents",
  bio: "Développeur FullStack mobile avec 4 ans d’expérience en création d’applications mobiles et backend. Passionné par l’art de transformer des idées en expériences numériques fluides et intuitives. Pour moi, coder, c’est avant tout résoudre des problèmes avec créativité, optimiser le parcours utilisateur et laisser une empreinte durable à travers des solutions techniquement solides et humainement pertinentes. .",
  
  // Photo de profil (placer le fichier dans public/assets/pictures/image.png)
  profileImage: "/assets/pictures/image.png",
  
  // Contact
  contact: {
    email: "fowengtcho@gmail.com",
    phone: "(+237) 6 57 59 08 08",
    location: "Douala, Cameroun",
    address: "Douala, Cameroun"
  },
  
  // Réseaux sociaux
  social: {
    github: "https://github.com/darrelX",
    linkedin: "https://www.linkedin.com/in/darrelX",
    twitter: "", // Optionnel
    instagram: "" // Optionnel
  },
  
  // À propos de moi - sections
  about: {
    mission: {
      title: "🎯 Mission",
      content: "Transformer des idées complexes en solutions mobiles élégantes et performantes. Je mets à profit mes compétences techniques et mon esprit analytique pour contribuer efficacement aux initiatives et évoluer au sein des organisations."
    },
    expertise: {
      title: "🛠️ Expertise", 
      content: "Spécialisé en développement mobile Flutter, architecture micro-services, analyse de données et intelligence artificielle. Compétent dans la conception d'applications conviviales et l'automatisation de rapports."
    },
    vision: {
      title: "🚀 Vision",
      content: "De l'idéation au déploiement, je m'assure de livrer des solutions pixel-perfect et mesurables. Mon approche combine créativité technique et rigueur méthodologique pour des résultats exceptionnels."
    }
  },
  
  // Statistiques
  stats: [
    { label: "Années d'expérience", value: 5, suffix: "+" },
    { label: "Projets réalisés", value: 15, suffix: "+" },
    { label: "Applications mobiles", value: 8, suffix: "+" },
    { label: "Clients satisfaits", value: 12, suffix: "+" }
  ],
  
  // Badges/Chips pour la section hero
  badges: [
    "+5 ans d'expérience",
    "Mobile & Full-Stack", 
    "Disponible"
  ],
  
  // Call-to-action
  cta: {
    primary: {
      text: "Découvrir mes projets",
      link: "#projets"
    },
    secondary: {
      text: "Me contacter", 
      link: "mailto:fowengtcho@gmail.com"
    }
  }
};

export default personalData;
