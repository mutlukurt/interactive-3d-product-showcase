// Global variables
let scene, camera, renderer, currentProduct;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let currentRotationX = 0, currentRotationY = 0;
let isMouseDown = false;
let autoRotate = false;
let zoomLevel = 1;

// Product data
const products = [
    {
        name: "Premium Headphones",
        price: "$299.99",
        description: "Experience crystal-clear audio with our premium wireless headphones featuring advanced noise cancellation and 30-hour battery life.",
        specs: {
            "Battery Life": "30 hours",
            "Weight": "250g",
            "Connectivity": "Bluetooth 5.0",
            "Warranty": "2 years"
        },
        color: 0x2563eb
    },
    {
        name: "Pro Smartphone",
        price: "$899.99",
        description: "Cutting-edge smartphone with triple-camera system, A17 Pro chip, and stunning 6.7-inch display with 120Hz refresh rate.",
        specs: {
            "Display": "6.7-inch OLED",
            "Storage": "256GB",
            "Camera": "48MP Triple",
            "Battery": "4000mAh"
        },
        color: 0x1f2937
    },
    {
        name: "Smart Watch Ultra",
        price: "$449.99",
        description: "Advanced fitness tracking, heart rate monitoring, GPS navigation, and 7-day battery life in a premium titanium case.",
        specs: {
            "Display": "1.9-inch Retina",
            "Battery": "7 days",
            "Water Resistance": "50m",
            "Material": "Titanium"
        },
        color: 0x7c3aed
    },
    {
        name: "MacBook Ultra",
        price: "$1,999.99",
        description: "Powerful laptop with M3 chip, 16-inch Liquid Retina display, and up to 22-hour battery life for professional workflows.",
        specs: {
            "Processor": "M3 Pro",
            "Memory": "32GB",
            "Storage": "1TB SSD",
            "Display": "16-inch Retina"
        },
        color: 0x6b7280
    }
];

let currentProductIndex = 0;

// Initialize the 3D scene
function init() {
    const viewport = document.getElementById('viewport');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.background = null; // Transparent background

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, viewport.clientWidth / viewport.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    viewport.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4ade80, 0.5);
    pointLight.position.set(-10, 0, 10);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(0x764ba2, 0.3);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // Create initial product
    createProduct(currentProductIndex);

    // Event listeners
    setupEventListeners();

    // Hide loading
    document.getElementById('loading').style.display = 'none';

    // Start animation loop
    animate();
}

function createProduct(index) {
    // Remove existing product
    if (currentProduct) {
        scene.remove(currentProduct);
    }

    const product = products[index];
    let geometry, material;

    // Create different geometries for different products
    switch (index) {
        case 0: // Headphones
            const headphonesGroup = new THREE.Group();
            
            // Headband
            const headbandGeometry = new THREE.TorusGeometry(1.2, 0.1, 8, 16, Math.PI);
            const headbandMaterial = new THREE.MeshPhongMaterial({ 
                color: product.color,
                shininess: 100
            });
            const headband = new THREE.Mesh(headbandGeometry, headbandMaterial);
            headband.rotation.x = Math.PI;
            headphonesGroup.add(headband);

            // Ear cups
            const cupGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
            const cupMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x1f2937,
                shininess: 50
            });
            
            const leftCup = new THREE.Mesh(cupGeometry, cupMaterial);
            leftCup.position.set(-1, 0, 0);
            leftCup.rotation.z = Math.PI / 2;
            headphonesGroup.add(leftCup);

            const rightCup = new THREE.Mesh(cupGeometry, cupMaterial);
            rightCup.position.set(1, 0, 0);
            rightCup.rotation.z = Math.PI / 2;
            headphonesGroup.add(rightCup);

            currentProduct = headphonesGroup;
            break;

        case 1: // Smartphone
            geometry = new THREE.BoxGeometry(1, 2, 0.2);
            material = new THREE.MeshPhongMaterial({ 
                color: product.color,
                shininess: 100
            });
            currentProduct = new THREE.Mesh(geometry, material);
            
            // Add screen
            const screenGeometry = new THREE.PlaneGeometry(0.9, 1.8);
            const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            screen.position.z = 0.11;
            currentProduct.add(screen);
            break;

        case 2: // Smartwatch
            const watchGroup = new THREE.Group();
            
            // Watch case
            const caseGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 8);
            const caseMaterial = new THREE.MeshPhongMaterial({ 
                color: product.color,
                shininess: 100
            });
            const watchCase = new THREE.Mesh(caseGeometry, caseMaterial);
            watchGroup.add(watchCase);

            // Watch band
            const bandGeometry = new THREE.TorusGeometry(0.8, 0.1, 4, 16);
            const bandMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x374151,
                shininess: 30
            });
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.rotation.x = Math.PI / 2;
            watchGroup.add(band);

            currentProduct = watchGroup;
            break;

        case 3: // Laptop
            const laptopGroup = new THREE.Group();
            
            // Base
            const baseGeometry = new THREE.BoxGeometry(2.5, 0.1, 1.8);
            const baseMaterial = new THREE.MeshPhongMaterial({ 
                color: product.color,
                shininess: 100
            });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            laptopGroup.add(base);

            // Screen
            const screenBodyGeometry = new THREE.BoxGeometry(2.4, 0.1, 1.5);
            const screen2 = new THREE.Mesh(screenBodyGeometry, baseMaterial);
            screen2.position.set(0, 0.75, -0.75);
            screen2.rotation.x = -Math.PI / 6;
            laptopGroup.add(screen2);

            currentProduct = laptopGroup;
            break;
    }

    currentProduct.castShadow = true;
    currentProduct.receiveShadow = true;
    scene.add(currentProduct);

    // Update product info
    updateProductInfo(index);
}

function updateProductInfo(index) {
    const product = products[index];
    document.getElementById('productInfo').innerHTML = `
        <h2>${product.name}</h2>
        <div class="price">${product.price}</div>
        <p>${product.description}</p>
    `;

    let specsHTML = '<h3>Specifications</h3>';
    for (const [key, value] of Object.entries(product.specs)) {
        specsHTML += `
            <div class="spec-item">
                <span>${key}</span>
                <span>${value}</span>
            </div>
        `;
    }
    document.getElementById('productSpecs').innerHTML = specsHTML;

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function setupEventListeners() {
    const viewport = document.getElementById('viewport');

    // Mouse events
    viewport.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    viewport.addEventListener('wheel', onWheel);

    // Touch events for mobile
    viewport.addEventListener('touchstart', onTouchStart);
    viewport.addEventListener('touchmove', onTouchMove);
    viewport.addEventListener('touchend', onTouchEnd);

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onMouseDown(event) {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseMove(event) {
    if (!isMouseDown) return;

    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;

    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;

    // Limit vertical rotation
    targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseUp() {
    isMouseDown = false;
}

function onWheel(event) {
    event.preventDefault();
    const delta = event.deltaY * -0.001;
    zoomLevel = Math.max(0.5, Math.min(3, zoomLevel + delta));
    camera.position.z = 5 / zoomLevel;
}

function onTouchStart(event) {
    if (event.touches.length === 1) {
        isMouseDown = true;
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    }
}

function onTouchMove(event) {
    event.preventDefault();
    if (event.touches.length === 1 && isMouseDown) {
        const deltaX = event.touches[0].clientX - mouseX;
        const deltaY = event.touches[0].clientY - mouseY;

        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;

        targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    }
}

function onTouchEnd() {
    isMouseDown = false;
}

function onWindowResize() {
    const viewport = document.getElementById('viewport');
    camera.aspect = viewport.clientWidth / viewport.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (currentProduct) {
        // Smooth rotation with easing
        currentRotationX += (targetRotationX - currentRotationX) * 0.05;
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;

        currentProduct.rotation.x = currentRotationX;
        currentProduct.rotation.y = currentRotationY;

        // Auto rotation when enabled
        if (autoRotate && !isMouseDown) {
            targetRotationY += 0.01;
        }

        // Gentle floating animation
        currentProduct.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }

    renderer.render(scene, camera);
}

// Control functions
function resetView() {
    targetRotationX = 0;
    targetRotationY = 0;
    zoomLevel = 1;
    camera.position.z = 5;
}

function zoomIn() {
    zoomLevel = Math.min(3, zoomLevel + 0.2);
    camera.position.z = 5 / zoomLevel;
}

function zoomOut() {
    zoomLevel = Math.max(0.5, zoomLevel - 0.2);
    camera.position.z = 5 / zoomLevel;
}

function toggleAutoRotate() {
    autoRotate = !autoRotate;
    const btn = document.getElementById('autoRotateBtn');
    btn.style.background = autoRotate ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.1)';
}

function switchProduct(index) {
    currentProductIndex = index;
    createProduct(index);
    resetView();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
}

// Initialize the application
window.addEventListener('load', init);
