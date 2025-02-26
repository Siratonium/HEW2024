window.addEventListener("load", () => {
    // モーダルの商品ID取得
    let modalflag = document.getElementsByClassName("product_modal_wrap")[0]

    console.log(modalflag)

    if (modalflag){
        // モーダルの商品ID取得
        const modal_id = modalflag.id
        console.log(modal_id)
        // 商品IDに対応したモデルの出力

        setTimeout(() => initThreeJs(modal_id), 100);

    }


    
//     const openModalBtns = document.querySelectorAll(".link");


//     openModalBtns.document.addEventListener("DOMContentLoaded", () => {
//     const openModalBtns = document.querySelectorAll(".link");
//     let scenes = {}, cameras = {}, renderers = {}, controls = {}, loaders = {};
//     let animationIds = {};
//     let models = {}; 

//     openModalBtns.forEach(link => {
//         link.addEventListener("click", (e)=> {
//             const modalId = e.target.id
//             console.log(modalId)
//             const modalElement = document.getElementById(modalId);
//             modalElement.style.display = "block";
//             console.log(`Modal opened: ${modalId}`);
//             setTimeout(() => initThreeJs(modalId), 100);
//         });
//     });

   
let scenes = {}, cameras = {}, renderers = {}, controls = {}, loaders = {};
let animationIds = {};
let models = {}; 


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
        if (!renderers[modalId]){return;}
        animationIds[modalId] = requestAnimationFrame(() => animate(modalId));
        controls[modalId].update();
        renderers[modalId].render(scenes[modalId], cameras[modalId]);
    }

    function loadModel(modalId) {

        let modelPaths = {};

        for (let i = 1; i < 30; i++) {
        modelPaths['p_' + i] = 'gltf/p_' + i + '.glb';
        }

        console.log(modelPaths);


        // let modelPaths = {
        //     p_1: 'gltf/p_1.gltf',
        //     p_2: 'gltf/パインアメ.glb',
        //     modal3: 'gltf/パインアメ.glb',
        //     modal4: 'gltf/パインアメ.glb',
        //     modal5: 'gltf/パインアメ.glb',
        //     modal6: 'gltf/パインアメ.glb'
        // };

        
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
