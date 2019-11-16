
let scene;
let camera;
let controls;
let renderer;
let loader = new THREE.PLYLoader();


// function initCamera() {
//   camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
//   camera.position.set(3, 3, 3);
// }

function addFigure() {
  const submitter = document.getElementsByClassName("control-element__file")[0];
  // if (0 === submitter.files.length) {
  //   console.log('Nothing to submit!');
  //   return;
  // }

  // const file = submitter.files[0];
  // const filename = file.name;

  // if (file) {
  //   console.log(`loading file ${filename}`);

    loader.load('./js/models/cord.ply', function (geometry) {
      console.log(`file has been loaded`);

      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial( { color: 0x0055ff, flatShading: true } );
      const mesh = new THREE.Mesh( geometry, material );

      var cubeAxis = new THREE.AxesHelper(20);
      mesh.add(cubeAxis);

      scene.add( mesh );
      console.log(`file has been added`);
    });
  // }
}


function main() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xcccccc );

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(200, 20, 200);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );

  animate();
}

function animate() {
  requestAnimationFrame( animate );

  controls.update();

  render();
}

function render() {
  renderer.render( scene, camera );
}


window.addEventListener("DOMContentLoaded", () => {
  console.log("Starting");
  try {
    main();

  } catch (e) {
    console.log('Error: ' + e.message + '\n' + e.stack);
  }
}, false);
