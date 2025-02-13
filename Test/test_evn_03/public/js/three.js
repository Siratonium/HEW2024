const button = document.getElementById('toggle-button');
const addModelButton = document.getElementById('add-model-button');
const addModelButton2 = document.getElementById('add-model-button-2');
const addModelButton3 = document.getElementById('add-model-button-3'); 
const addModelButton4 = document.getElementById('add-model-button-4');


const hiddenElement = document.getElementById('hidden-element');
const hideButton = document.getElementById('hide');
let scene, camera, renderer, model, additionalModel, controls;

window.onload = () => {
  initThreeJS();
  animate();
}

button.addEventListener('click', () => {
  toggleVisibility();
});

hideButton.addEventListener('click', () => {
  hiddenElement.style.display = 'none';
  button.textContent = 'three.js 要素を表示';
});


//追加するとこ
addModelButton.addEventListener('click', () => {
  Model_A();
});

addModelButton2.addEventListener('click', () => { 
  Model_B();
});

addModelButton3.addEventListener('click', () => { 
  Model_C();
});

addModelButton4.addEventListener('click', () => { 
  Model_D();
});




function toggleVisibility() {
  if (hiddenElement.style.display === 'none') {
    hiddenElement.style.display = 'block';
    button.textContent = 'three.js 要素非表示';
  } else {
    hiddenElement.style.display = 'none';
    button.textContent = 'three.js 要素を表示';
  }
}

function initThreeJS() {
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, hiddenElement.clientWidth / hiddenElement.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(hiddenElement.clientWidth, hiddenElement.clientHeight);
  renderer.setClearColor(0x000000, 0);
  hiddenElement.appendChild(renderer.domElement);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); //放射光源　特定の位置から光を当てたいときにつかう　これが無いと影が無くなる
  directionalLight.position.set(1, 1, 1); // カメラの位置　（x,y,z）
  directionalLight.castShadow = true; 
  scene.add(directionalLight);

  const light = new THREE.AmbientLight(0xFFFFFF, 1); //環境光源　シーン全体に光を当てたいときに使う　
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load('gltf/sunnpou.gltf', function(gltf) {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    scene.add(model);
  }, undefined, function(error) {
    console.error(error);
  });
}


function Model_A() {
  //前モデルの削除
  if (model) {
    scene.remove(model,additionalModel);
  }
  //モデル追加　GLTFローダーがないと機能しない
  const loader = new THREE.GLTFLoader();
  loader.load('gltf/miniコーラ.gltf', function(gltf) { 
    additionalModel = gltf.scene;
    additionalModel.scale.set(0.75, 0.75, 0.75); //モデルのスケールを調整可能
    additionalModel.position.set(0, -1.5, 0); //モデルの位置を調整　（x,y,z）
    scene.add(additionalModel);
    //カメラ位置リセット
    camera.position.set(0, 0, 5); 
    camera.lookAt(0, -1.5, 0);
  }, undefined);
}


function Model_B() {
  if (model) {
    scene.remove(model,additionalModel);
  }
  const loader = new THREE.GLTFLoader();
  loader.load('gltf/ポッキー.glb', function(gltf) { 
    additionalModel = gltf.scene;
    additionalModel.scale.set(1, 1, 1); 
    additionalModel.position.set(0, 0, 0); 
    scene.add(additionalModel);
    camera.position.set(0, 0, 5); 
    camera.lookAt(0, -1.5, 0);
  }, undefined);
}


function Model_C() {
  if (model) {
    scene.remove(model,additionalModel);
  }
  const loader = new THREE.GLTFLoader();
  loader.load('gltf/チョコベビー.glb', function(gltf) { 
    additionalModel = gltf.scene;
    additionalModel.scale.set(3, 3, 3); 
    additionalModel.position.set(0, -2, 0); 
    scene.add(additionalModel);
    camera.position.set(0, 0, 5); 
    camera.lookAt(0, -1.5, 0);
  }, undefined);
}


function Model_D() {
  if (model) {
    scene.remove(model,additionalModel);
  }
  const loader = new THREE.GLTFLoader();
  loader.load('gltf/konnbu.glb', function(gltf) { 
    additionalModel = gltf.scene;
    additionalModel.scale.set(1, 1, 1); 
    additionalModel.position.set(0, 1, 0); 
    scene.add(additionalModel);
    camera.position.set(0, 0, 5); 
    camera.lookAt(0, -1.5, 0);
  }, undefined);
}

function Model_E() {
  if (model) {
    scene.remove(model,additionalModel);
  }
  const loader = new THREE.GLTFLoader();
  loader.load('gltf/hairemonn.glb', function(gltf) { 
    additionalModel = gltf.scene;
    additionalModel.scale.set(1, 1, 1); 
    additionalModel.position.set(0, 1, 0); 
    scene.add(additionalModel);
    camera.position.set(0, 0, 5); 
    camera.lookAt(0, -1.5, 0);
  }, undefined);
}



//アニメーションのとこ
function animate() {
  requestAnimationFrame(animate);
  
  if (controls) controls.update();

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false; // ズームするとこ　消せばズーム可能になる
  controls.enablePan = false; // この行をけすと右クリックでモデルの移動を可能にする　
  controls.rotateSpeed = 0.002; // この数字を小さくするとモデルの回転速度鈍化 
  
  renderer.render(scene, camera);//シーンとカメラの有効化
}

