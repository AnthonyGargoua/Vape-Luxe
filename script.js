// --- INITIALISATION 3D ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.querySelector('#container-3d');

renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Objet 3D (Cylindre stylisé)
const geometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
const material = new THREE.MeshPhongMaterial({ color: 0x111111, shininess: 100, specular: 0x00ffcc });
const vape = new THREE.Mesh(geometry, material);
scene.add(vape);

// Lumières
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

camera.position.z = 5;

// Vapeur (Système de particules)
let particles = [];
function createSteam() {
    for (let i = 0; i < 20; i++) {
        const pGeom = new THREE.PlaneGeometry(0.2, 0.2);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
        const p = new THREE.Mesh(pGeom, pMat);
        p.position.set(0, 2, 0);
        p.userData = { vx: (Math.random()-0.5)*0.02, vy: Math.random()*0.05, op: 0.4 };
        scene.add(p);
        particles.push(p);
    }
}

function animate() {
    requestAnimationFrame(animate);
    vape.rotation.y += 0.005;
    
    particles.forEach((p, i) => {
        p.position.x += p.userData.vx;
        p.position.y += p.userData.vy;
        p.userData.op -= 0.005;
        p.material.opacity = p.userData.op;
        if(p.userData.op <= 0) { scene.remove(p); particles.splice(i, 1); }
    });
    renderer.render(scene, camera);
}
animate();

// Interactions 3D
container.addEventListener('mousedown', () => { createSteam(); vape.scale.set(0.9, 0.9, 0.9); });
container.addEventListener('mouseup', () => { vape.scale.set(1, 1, 1); });

// --- LOGIQUE PANIER ---
let cart = [];
const cartSidebar = document.getElementById('cart-sidebar');

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        cart.push({name, price});
        updateCart();
        cartSidebar.classList.add('open');
    });
});

function updateCart() {
    const items = document.getElementById('cart-items');
    items.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        items.innerHTML += `<div class="cart-item"><span>${item.name}</span><span>${item.price}€</span></div>`;
    });
    document.getElementById('cart-total').innerText = total.toFixed(2);
    document.getElementById('cart-count').innerText = cart.length;
}

document.querySelector('.cta').onclick = () => cartSidebar.classList.add('open');
document.getElementById('close-cart').onclick = () => cartSidebar.classList.remove('open');

// --- AGE GATE ---
function verifyAge() {
    document.getElementById('age-gate').classList.add('hidden');
}
