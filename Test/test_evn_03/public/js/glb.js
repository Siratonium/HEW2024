document.addEventListener("DOMContentLoaded", () => {
    const openModalBtns = document.querySelectorAll(".link");
    const closeModalBtns = document.querySelectorAll(".close");
    let scenes = {}, cameras = {}, renderers = {}, controls = {}, loaders = {};
    let animationIds = {};
    let models = {}; 

    openModalBtns.forEach(link => {
        link.addEventListener("click", (e)=> {
            const modalId = e.target.id
            console.log(modalId)
            const modalElement = document.getElementById(modalId);
            modalElement.style.display = "block";
            console.log(`Modal opened: ${modalId}`);
            setTimeout(() => initThreeJs(modalId), 100);
        });
    });

    closeModalBtns.forEach(button => {
        button.addEventListener("click", function() {
            const modalId = this.getAttribute("data-modal");
            closeModal(modalId);
        });
    });

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = "none";
        
        if (renderers[modalId]) {
            cancelAnimationFrame(animationIds[modalId]);
            renderers[modalId].dispose();
            renderers[modalId] = null;
        }

        const existingCanvas = document.getElementById(`tCC-${modalId}`).querySelector("canvas");
        if (existingCanvas) {
            existingCanvas.remove();
        }

        if (models[modalId]) {
            scenes[modalId].remove(models[modalId]);
            models[modalId] = null;
        }
    }

    function initThreeJs(modalId) {
        const canvasContainer = document.getElementById(`tCC-${modalId}`);
        if (!canvasContainer) {
            console.error(`Canvas container not found for modal ID: ${modalId}`);
            return;
        }
        console.log(`Canvas container found for modal ID: ${modalId}`); // Debugging log

        // Create scene, camera, and renderer
        scenes[modalId] = new THREE.Scene();
        cameras[modalId] = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        cameras[modalId].position.set(0, 1, 5);

        renderers[modalId] = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderers[modalId].setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderers[modalId].setPixelRatio(window.devicePixelRatio);
        renderers[modalId].setClearColor(0xE1D1C4, 1); // Set background color
        canvasContainer.appendChild(renderers[modalId].domElement);

        // Add lighting to the scene
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        scenes[modalId].add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(1, 1, 1);
        scenes[modalId].add(directionalLight);

        loaders[modalId] = new THREE.GLTFLoader();

        // Initialize orbit controls
        controls[modalId] = new THREE.OrbitControls(cameras[modalId], renderers[modalId].domElement);
        controls[modalId].enableZoom = false;
        controls[modalId].enablePan = false;
        controls[modalId].enableDamping = true;

        // Load the model specific to the modal
        loadModel(modalId);
        animate(modalId);
    }

    function animate(modalId) {
        if (!renderers[modalId]) return;
        animationIds[modalId] = requestAnimationFrame(() => animate(modalId));
        controls[modalId].update();
        renderers[modalId].render(scenes[modalId], cameras[modalId]);
    }

    function loadModel(modalId) {
        const modelPaths = {
            modal1: 'gltf/sunnpou.gltf',
            modal2: 'gltf/パインアメ.glb',
            modal3: 'gltf/パインアメ.glb',
            modal4: 'gltf/パインアメ.glb',
            modal5: 'gltf/パインアメ.glb',
            modal6: 'gltf/パインアメ.glb'
        };

        if (!modelPaths[modalId]) {
            console.error(`No model found for modal: ${modalId}`);
            return;
        }

        loaders[modalId].load(modelPaths[modalId], function(gltf) {
            console.log(`Model loaded for ${modalId}`); // Debugging log
            if (models[modalId]) {
                scenes[modalId].remove(models[modalId]);
            }
            models[modalId] = gltf.scene;
            scenes[modalId].add(models[modalId]);
        }, undefined, function(error) {
            console.error(`Error loading model for ${modalId}: `, error);
        });
    }
});
