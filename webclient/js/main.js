let scene;
let camera;
let controls;
let renderer;
let loader = new THREE.PLYLoader();
let figures = [];


function initCamera() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(200, 20, 200);
}

function toggleAngle() {
  const toggler = document.getElementById("control-element__ranger");
  const angleValue = toggler.value;

  if (0 !== figures.length) {
    figures[0].rotation.x = THREE.Math.degToRad(angleValue);
  }
}

function addFigure() {
  const submitter = document.getElementsByClassName("control-element__file")[0];
  if (0 === submitter.files.length) {
    console.log('Nothing to submit!');
    return;
  }

  const file = submitter.files[0];

  if (file) {
    console.log(`loading file ${file.name}`);

    loader.load('./js/models/' + file.name, function (geometry) {
      geometry.computeVertexNormals();

      const color = new THREE.Color(0xffffff);
      color.setHex(Math.random() * 0xffffff);

      const opacityMin = 0.3;
      const opacityMax = 0.8;
      const opacity = (Math.random() * (opacityMax - opacityMin) + opacityMin).toFixed(4);

      const material = new THREE.MeshStandardMaterial({
        color: color,
        flatShading: true,
        side: THREE.DoubleSide,
        opacity: opacity,
        transparent: true
      });
      const mesh = new THREE.Mesh(geometry, material);

      figures.push(mesh);
      scene.add(mesh);
    });
  }
}


function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
}

function initLight() {
  const light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff);
  light2.position.set(1, -1, 0);
  scene.add(light2);
}

function initCanvas() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // appending renderer as canvas
  document.body.appendChild(renderer.domElement);
}

function initControls() {
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
}

function initAxis() {
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);
}

function main() {
  // mandatory set up
  initScene();
  initCamera();
  initCanvas();
  initControls();

  // optional
  initAxis();
  initLight();

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();


  render();
}

function render() {
  renderer.render(scene, camera);

  // toggleAngle();
}


window.addEventListener("DOMContentLoaded", () => {
  console.log("Starting");
  try {
    main();

  } catch (e) {
    console.log('Error: ' + e.message + '\n' + e.stack);
  }
}, false);
