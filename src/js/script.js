function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const burgerIcon = document.getElementById('burger-icon');
  menu.classList.toggle('hidden');
  menu.classList.toggle('flex');

  // Transformation du menu burger en croix
  burgerIcon.classList.toggle('open');
  if (burgerIcon.classList.contains('open')) {
    console.log(burgerIcon.children);
    burgerIcon.children[0].classList.add('rotate-45', 'translate-y-2');
    burgerIcon.children[1].classList.add('opacity-0');
    burgerIcon.children[2].classList.add('-rotate-45', '-translate-y-2');
  } else {
    burgerIcon.children[0].classList.remove('rotate-45', 'translate-y-2');
    burgerIcon.children[1].classList.remove('opacity-0');
    burgerIcon.children[2].classList.remove('-rotate-45', '-translate-y-2');
  }
}

function genererLienWhatsApp() {
  const numero = "237657590808"; // Numéro sans le "+"
  const message = "Bonjour Monsieur, je suis intéressé par vos services";
  const lien = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
  window.open(lien, "_blank");
}

const items = [
  {
    title: "OnBush's Application",
    company: "Symphoni Social",
    description: "Academic management app allowing students to access affordable online courses",
    technologies: "Fluter, Dart, MySQL, Laravel ",
    duration: "Nov 2024 - Now"
  },
  {
    title: "Jong's Appication",
    company: "Symphoni Social",
    description: "Developed a Flutter-based Android app for a beer sales platform with a game of chance, enhancing my mobile development skills.",
    technologies: "Python, Django",
    duration: "Jul 2024 - Aug 2024"
  },
  {
    title: "Web Devolpment internship",
    company: "LaMater Tech",
    description: "The internship focuses on the development of various IT projects for the company",
    technologies: "Flutter, Dart, Laravell. PostgreSql",
    duration: "Jun 2023 - Jul 2023"
  },
  {
    title: "Web Devolpment internship",
    company: "GESMARTER_GROUP",
    description: "Software systems design.",
    technologies: "Python, Django",
    duration: "Jul 2022 - Aug 2022"
  },
  {
    title: "IT internship",
    company: "CINCUB ENSOD",
    description: "Software systems design.",
    technologies: "Python, Laravel, Firebase, MySql, Flutter",
    duration: "Jul 2021 - Au 2021"
  },

];

function renderTimeline() {
  const timelineContainer = document.getElementById('timeline');
  timelineContainer.innerHTML = '';

  items.forEach((item, index) => {
    const isLeft = index % 2 === 0;

    const timelineItem = `
      <div class="flex flex-row items-stretch">
        ${isLeft ? getCartWidget(item, isLeft) : '<div class="flex-1"></div>'}
        <div id="vertical-line" class="flex flex-col items-center justify-center">
          <div class="w-14 h-14 bg-black rounded-full flex items-center justify-center">
            <div class="w-12 h-12 bg-blue-500 rounded-full"></div>
          </div>
          <div class="w-1 bg-black flex-grow"></div>
        </div>
        ${!isLeft ? getCartWidget(item, isLeft) : '<div class="flex-1"></div>'}
      </div>
    `;
    timelineContainer.innerHTML += timelineItem;
  });
}

function getCartWidget(item, isLeft) {
  return `
    <div class="flex flex-1 flex-row items-center ${isLeft ? 'justify-end' : 'justify-start'}">
      <div class="w-[30vw] p-4 bg-white shadow-lg rounded-lg flex flex-col justify-center items-center ${isLeft ? 'mr-[4vw]' : 'ml-[4vw]'}">
        <h3 class="text-lg font-bold text-center">${item.title}</h3>
        <p class="text-md font-semibold text-center">${item.company}</p>
        <p class="mt-2 text-gray-600 text-center">${item.description}</p>
        <p class="mt-3 text-gray-500 text-center">${item.technologies}</p>
        <p class="mt-2 italic text-gray-400 text-center">${item.duration}</p>
      </div>
    </div>
  `;
}

function toggleVerticalLine() {
  if (window.innerWidth <= 768) {
    renderMobileTimeline();
  } else {
    renderTimeline();
  }
}

function renderMobileTimeline() {
  const timelineContainer = document.getElementById('timeline');
  timelineContainer.innerHTML = '';

  items.forEach((item) => {
    const timeline = `
      <div class="flex flex-row justify-center mb-10">
        <div class="flex flex-1 flex-row items-start justify-center">
          <div class=" w-[90vw] rounded-lg border-gray-400 p-6 shadow-lg">
            <p class="text-lg text-center font-bold">${item.title}</p>
            <p class="text-base text-center font-semibold">${item.company}</p>
            <p class="text-center my-2 text-gray-600">${item.description}</p>
            <p class="text-center text-gray-500">${item.technologies}</p>
            <p class="text-center text-gray-400 italic">${item.duration}</p>
          </div>
        </div>
      </div>
    `;
    timelineContainer.innerHTML += timeline;
  });
}

window.addEventListener('resize', toggleVerticalLine);
window.addEventListener('load', toggleVerticalLine);

// Fonction pour afficher le modal et charger les images
let currentIndex = 0;  // Index actuel de l'image
let images = [];        // Tableau des images

function fcn(value) {
  // Récupérer la valeur de l'attribut data-images
  images = JSON.parse(value.getAttribute('data-images'));

  // Afficher la première image
  currentIndex = 0;
  updateImage();

  // Afficher le modal
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal').classList.add('flex');
}

function updateImage() {
  const modalContent = document.getElementById('modal-content');

  // Vider le contenu précédent
  modalContent.innerHTML = '';

  // Ajouter la nouvelle image
  const imgElement = document.createElement('img');
  imgElement.src = images[currentIndex];
  imgElement.alt = "Image " + (currentIndex + 1);
  imgElement.classList.add('rounded-lg', 'h-[90%]', 'w-[90%]', 'object-cover');
  modalContent.appendChild(imgElement);
}

document.addEventListener('DOMContentLoaded', function () {
  const closeModalBtn = document.getElementById('close-modal');
  const modal = document.getElementById('modal');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  // Fermer la modale
  closeModalBtn.addEventListener('click', function () {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });

  // Fermer en cliquant en dehors de la modale
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });

  // Bouton Précédent
  prevBtn.addEventListener('click', function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateImage();
    }
  });

  // Bouton Suivant
  nextBtn.addEventListener('click', function () {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateImage();
    }
  });
});


window.onscroll = function () {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / scrollHeight) * 100;
  document.getElementById("progress-bar").style.width = scrolled + "%";
};


// Initialiser EmailJS avec ton User ID
emailjs.init("MXBLyOZTuzKpfgAqv"); // Remplace avec ton User ID EmailJS

document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupération des valeurs du formulaire
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Vérification rapide des champs
  if (!name || !email || !message) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  // Configuration des paramètres EmailJS
  const serviceID = "service_seti1bs"; // Remplace avec ton Service ID EmailJS
  const templateID = "template_k55gf8n"; // Remplace avec ton Template ID EmailJS

  const templateParams = {
    to_name: "Darrel",
    from_name: name,
    from_email: email,
    message: message
  };

  // Envoi de l'e-mail avec EmailJS
  emailjs.send(serviceID, templateID, templateParams)
    .then((response) => {
      alert("Email sent successfully ✅");
      document.getElementById("contactForm").reset(); // Réinitialiser le formulaire
      console.log("Success:", response);
    })
    .catch((error) => {
      alert("Error sending email ❌");
      console.error("Erreur:", error);
    });
});