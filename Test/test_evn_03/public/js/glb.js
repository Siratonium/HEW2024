document.addEventListener("DOMContentLoaded", () => {
    const openModalBtns = document.querySelectorAll(".openModalBtn");
    const closeModalBtns = document.querySelectorAll(".close");
    let scenes = {}, cameras = {}, renderers = {}, controls = {}, loaders = {};
    let animationIds = {};
    let models = {}; 

    openModalBtns.forEach(button => {
        button.addEventListener("click", function() {
            const modalId = this.getAttribute("data-modal");
            document.getElementById(modalId).style.display = "block";
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
        if (renderers[modalId]) return;

        const canvasContainer = document.getElementById(`tCC-${modalId}`);
        if (!canvasContainer) {
            console.error(` ${modalId}`);
            return;
        }

        // シーン・カメラ・レンダラー
        scenes[modalId] = new THREE.Scene();
        cameras[modalId] = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        cameras[modalId].position.set(0, 1, 5);

        renderers[modalId] = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderers[modalId].setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderers[modalId].setPixelRatio(window.devicePixelRatio);
        renderers[modalId].setClearColor(0xE1D1C4, 1); // 背景色 0x の後にカラーコード
        canvasContainer.appendChild(renderers[modalId].domElement);

        // 光
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        scenes[modalId].add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(1, 1, 1);
        scenes[modalId].add(directionalLight);

        loaders[modalId] = new THREE.GLTFLoader();

        // OrbitControls
        controls[modalId] = new THREE.OrbitControls(cameras[modalId], renderers[modalId].domElement);
        controls[modalId].enableZoom = false;
        controls[modalId].enablePan = false;
        controls[modalId].enableDamping = true;

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
            console.error(`モデルが見つかりません: ${modalId}`);
            return;
        }

        loaders[modalId].load(modelPaths[modalId], function(gltf) {
            if (models[modalId]) {
                scenes[modalId].remove(models[modalId]); // 以前のモデルを削除
            }
            models[modalId] = gltf.scene;
            scenes[modalId].add(models[modalId]);
        }, undefined, function(error) {
            console.error(`モデルの読み込みエラー: ${modelPaths[modalId]}`, error);
        });
    }
});
