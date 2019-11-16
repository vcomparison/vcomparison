import * as THREE from "three/src/Three";

/**
 * Created by anthony on 16/11/2019.
 */
export default class Model {

  constructor(geometry) {
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
      // Transparent surfaces don't play well with the z-buffer,
      // and as such must be manually sorted and rendered back-to-front
      opacity: opacity,
      transparent: true
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.rotateOverY(THREE.Math.degToRad(180));
    this.rotateOverZ(THREE.Math.degToRad(180));
    this.rotateOverX(THREE.Math.degToRad(90));
  }

  rotateOverX = (degree) => {
    this.mesh.rotateX(THREE.Math.degToRad(degree));
  };

  rotateOverY = (degree) => {
    this.mesh.rotateY(THREE.Math.degToRad(degree));
  };

  rotateOverZ = (degree) => {
    this.mesh.rotateZ(THREE.Math.degToRad(degree));
  };

  draw = (scene) => {
    scene.add(this.mesh);
  }
}
