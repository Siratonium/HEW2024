window.addEventListener("load", () => {
    // モーダルの商品ID取得
    let modalflag = document.getElementsByClassName("product_modal_wrap")[0];

    console.log(modalflag);

    if (modalflag) {
        // モーダルの商品ID取得
        const modal_id = modalflag.id;
        console.log(modal_id);
        
        // 商品IDに対応したモデルの出力
        setTimeout(() => initThreeJs(modal_id), 100);
    }

    let scenes = {}, cameras = {}, renderers = {}, controls = {}, loaders = {};
    let animationIds = {}, models = {}; 
    let isUserInteracting = false; // マウス操作中かどうかを判定するフラグ

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

        // マウス操作の開始・終了を検知
        controls[modalId].addEventListener('start', () => { isUserInteracting = true; });
        controls[modalId].addEventListener('end', () => { isUserInteracting = false; });
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('nanimoirenai', function(texture) {
            const backgroundGeometry = new THREE.PlaneGeometry(20, 20); // 背景の大きさ
            const backgroundMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
            backgroundMesh.position.set(0, 0, -10); // カメラの後ろに配置
            scenes[modalId].add(backgroundMesh);
        });

        // Load the model specific to the modal
        loadModel(modalId);
        animate(modalId);
    }

    function animate(modalId) {
        if (!renderers[modalId]) { return; }
        animationIds[modalId] = requestAnimationFrame(() => animate(modalId));
        if (!isUserInteracting && models[modalId]) {
            models[modalId].rotation.y += 0.01; //ここで速度かえる
        }
        controls[modalId].update(); 
        renderers[modalId].render(scenes[modalId], cameras[modalId]);
    }

    function loadModel(modalId) {
        let modelPaths = {};

        for (let i = 1; i < 61; i++) {
            modelPaths['p_' + i] = 'gltf/p_' + i + '.glb';
        }

        console.log(modelPaths);

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
