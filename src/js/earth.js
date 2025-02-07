// 🎯 Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 🎨 Sélection du canvas spécifique
const canvas = document.getElementById("globeCanvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
const container = document.getElementById("globeContainer");

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff, 1); // Fond blanc

// 🌍 Création de la sphère (Globe terrestre)
const geometry = new THREE.SphereGeometry(2, 64, 64);
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg");
const material = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// ☁ Ajout d’une couche de nuages semi-transparente
const cloudTexture = textureLoader.load("https://threejs.org/examples/textures/earth_clouds.png");
const cloudMaterial = new THREE.MeshStandardMaterial({ map: cloudTexture, transparent: true, opacity: 0.5 });
const clouds = new THREE.Mesh(geometry, cloudMaterial);
clouds.scale.set(1.02, 1.02, 1.02); // Légèrement plus grand que la Terre
scene.add(clouds);

// 💡 Ajout d'une lumière (avec ombre pour contraste)
const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(5, 3, 5);
scene.add(light);

// 📸 Position de la caméra
camera.position.z = 5;

// 🎛 Ajout du contrôle tactile et souris (glisser et zoomer)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Inertie
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5; // Vitesse de rotation
controls.zoomSpeed = 1.2; // Vitesse de zoom
controls.enablePan = false; // Désactiver le déplacement horizontal

// 🌀 Animation de la rotation automatique
let rotationSpeed = 0.002;

function animate() {
    requestAnimationFrame(animate);
    if (!controls.isDragging) { // Tourne seulement si l'utilisateur ne touche pas
        earth.rotation.y += rotationSpeed;
        clouds.rotation.y += rotationSpeed * 1.2;
    }
    controls.update();
    renderer.render(scene, camera);
}

animate();

// 📱 Adapter la taille du canvas si la fenêtre change
window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
});
