// ===== MOBILE-FIRST RESPONSIVE 3D PRODUCT SHOWCASE =====
// Global variables
let scene, camera, renderer, currentProduct;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let currentRotationX = 0, currentRotationY = 0;
let isMouseDown = false;
let autoRotate = false;
let zoomLevel = 1;
let isMobile = false;
let touchStartDistance = 0;
let initialZoomLevel = 1;
let isProductCardClosed = false; // Track card state

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
    
    // Detect mobile device
    detectDevice();
    
    // Initialize product card state
    initializeProductCard();
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.background = null; // Transparent background

    // Camera setup with responsive aspect ratio
    const aspectRatio = viewport.clientWidth / viewport.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer setup with performance optimizations
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    viewport.appendChild(renderer.domElement);

    // Lighting setup
    setupLighting();

    // Create initial product
    createProduct(currentProductIndex);

    // Event listeners
    setupEventListeners();

    // Hide loading
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    // Start animation loop
    animate();
}

// Initialize product card state
function initializeProductCard() {
    // Check if user has previously closed the card (localStorage)
    const cardClosed = localStorage.getItem('productCardClosed');
    if (cardClosed === 'true') {
        closeProductCard();
    }
    
    // Show info toggle button if card is closed
    updateInfoToggleVisibility();
}

// Device detection
function detectDevice() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    
    // Add mobile class to body for CSS targeting
    document.body.classList.toggle('mobile', isMobile);
}

// Lighting setup
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024; // Reduced for mobile performance
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4ade80, 0.5);
    pointLight.position.set(-10, 0, 10);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(0x764ba2, 0.3);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);
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
    const productInfoElement = document.getElementById('productInfo');
    const productSpecsElement = document.getElementById('productSpecs');
    
    if (productInfoElement) {
        productInfoElement.innerHTML = `
            <h2>${product.name}</h2>
            <div class="price">${product.price}</div>
            <p>${product.description}</p>
        `;
    }

    if (productSpecsElement) {
        let specsHTML = '<h3>Specifications</h3>';
        for (const [key, value] of Object.entries(product.specs)) {
            specsHTML += `
                <div class="spec-item">
                    <span>${key}</span>
                    <span>${value}</span>
                </div>
            `;
        }
        productSpecsElement.innerHTML = specsHTML;
    }

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function setupEventListeners() {
    const viewport = document.getElementById('viewport');
    if (!viewport) return;

    // Mouse events
    viewport.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    viewport.addEventListener('wheel', onWheel);

    // Touch events for mobile
    viewport.addEventListener('touchstart', onTouchStart, { passive: false });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd);

    // Window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(onWindowResize, 100);
    });

    // Keyboard navigation
    document.addEventListener('keydown', onKeyDown);

    // Prevent context menu on long press (mobile)
    viewport.addEventListener('contextmenu', (e) => e.preventDefault());
}

function onMouseDown(event) {
    if (isMobile) return; // Disable mouse events on mobile
    
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    event.preventDefault();
}

function onMouseMove(event) {
    if (!isMouseDown || isMobile) return;

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
    if (isMobile) return; // Disable wheel on mobile
    
    event.preventDefault();
    const delta = event.deltaY * -0.001;
    zoomLevel = Math.max(0.5, Math.min(3, zoomLevel + delta));
    if (camera) {
        camera.position.z = 5 / zoomLevel;
    }
}

// Enhanced touch handling for mobile
function onTouchStart(event) {
    if (event.touches.length === 1) {
        // Single touch - rotation
        isMouseDown = true;
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
        // Two finger touch - pinch to zoom
        touchStartDistance = getTouchDistance(event.touches);
        initialZoomLevel = zoomLevel;
    }
}

function onTouchMove(event) {
    event.preventDefault();
    
    if (event.touches.length === 1 && isMouseDown) {
        // Single touch rotation
        const deltaX = event.touches[0].clientX - mouseX;
        const deltaY = event.touches[0].clientY - mouseY;

        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;

        targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
        // Two finger pinch to zoom
        const currentDistance = getTouchDistance(event.touches);
        const scale = currentDistance / touchStartDistance;
        zoomLevel = Math.max(0.5, Math.min(3, initialZoomLevel * scale));
        if (camera) {
            camera.position.z = 5 / zoomLevel;
        }
    }
}

function onTouchEnd() {
    isMouseDown = false;
    touchStartDistance = 0;
}

// Helper function to calculate distance between two touch points
function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Keyboard navigation support
function onKeyDown(event) {
    switch(event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            targetRotationY -= 0.1;
            break;
        case 'ArrowRight':
            event.preventDefault();
            targetRotationY += 0.1;
            break;
        case 'ArrowUp':
            event.preventDefault();
            targetRotationX -= 0.1;
            break;
        case 'ArrowDown':
            event.preventDefault();
            targetRotationX += 0.1;
            break;
        case 'Escape':
            if (isMobile && !isProductCardClosed) {
                closeProductCard();
            }
            break;
    }
}

function onWindowResize() {
    const viewport = document.getElementById('viewport');
    if (!viewport || !camera || !renderer) return;
    
    // Update camera aspect ratio
    camera.aspect = viewport.clientWidth / viewport.clientHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    
    // Update pixel ratio for high-DPI displays
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Control functions
function resetView() {
    targetRotationX = 0;
    targetRotationY = 0;
    zoomLevel = 1;
    if (camera) {
        camera.position.z = 5;
    }
}

function zoomIn() {
    zoomLevel = Math.min(3, zoomLevel + 0.2);
    if (camera) {
        camera.position.z = 5 / zoomLevel;
    }
}

function zoomOut() {
    zoomLevel = Math.max(0.5, zoomLevel - 0.2);
    if (camera) {
        camera.position.z = 5 / zoomLevel;
    }
}

function toggleAutoRotate() {
    autoRotate = !autoRotate;
    const btn = document.getElementById('autoRotateBtn');
    if (btn) {
        btn.style.background = autoRotate ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    }
}

function switchProduct(index) {
    currentProductIndex = index;
    createProduct(index);
    resetView();
}

// ===== PRODUCT CARD MANAGEMENT =====

// Close product card
function closeProductCard() {
    const productCard = document.getElementById('productCard');
    if (!productCard) return;
    
    // Add closed class for animation
    productCard.classList.add('closed');
    
    // Update state
    isProductCardClosed = true;
    
    // Save preference to localStorage
    try {
        localStorage.setItem('productCardClosed', 'true');
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
    
    // Enable viewport interaction
    enableViewportInteraction();
    
    // Show info toggle button
    updateInfoToggleVisibility();
    
    // Enable body scroll on mobile
    if (isMobile) {
        document.body.style.overflow = '';
    }
}

// Open product card
function openProductCard() {
    const productCard = document.getElementById('productCard');
    if (!productCard) return;
    
    // Remove closed class for animation
    productCard.classList.remove('closed');
    
    // Update state
    isProductCardClosed = false;
    
    // Save preference to localStorage
    try {
        localStorage.setItem('productCardClosed', 'false');
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
    
    // Disable viewport interaction on mobile
    if (isMobile) {
        disableViewportInteraction();
        document.body.style.overflow = 'hidden';
    }
    
    // Hide info toggle button
    updateInfoToggleVisibility();
}

// Update info toggle button visibility
function updateInfoToggleVisibility() {
    const infoToggle = document.getElementById('infoToggle');
    if (!infoToggle) return;
    
    if (isProductCardClosed && isMobile) {
        infoToggle.classList.add('visible');
    } else {
        infoToggle.classList.remove('visible');
    }
}

// Enable viewport interaction (3D model controls)
function enableViewportInteraction() {
    const viewport = document.getElementById('viewport');
    if (viewport) {
        viewport.style.pointerEvents = 'auto';
        viewport.style.userSelect = 'auto';
    }
}

// Disable viewport interaction when card is open
function disableViewportInteraction() {
    const viewport = document.getElementById('viewport');
    if (viewport) {
        viewport.style.pointerEvents = 'none';
        viewport.style.userSelect = 'none';
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (event) => {
    if (isMobile) {
        const sidebar = document.getElementById('sidebar');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            !mobileToggle.contains(event.target) &&
            !overlay.contains(event.target)) {
            // Assuming toggleSidebar is defined elsewhere or will be added
            // toggleSidebar(); 
        }
    }
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        if (autoRotate) {
            autoRotate = false;
            const btn = document.getElementById('autoRotateBtn');
            if (btn) btn.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    }
});

// Initialize the application
window.addEventListener('load', init);

// Add loading state management
window.addEventListener('beforeunload', () => {
    // Clean up resources
    if (renderer) {
        renderer.dispose();
    }
});
