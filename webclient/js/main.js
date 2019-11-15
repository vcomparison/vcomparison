

function main() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  console.log('redering qube');

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame( animate );


    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;


    renderer.render( scene, camera );
  }
  animate();
}


window.addEventListener("DOMContentLoaded", () => {
  console.log("Starting");
  try {
    main();

  } catch (e) {
    console.log('Error: ' + e.message + '\n' + e.stack);
  }
}, false);
