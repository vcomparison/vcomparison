import * as THREE from "three/src/Three";

/**
 * Created by anthony on 16/11/2019.
 */

export default class Slicer {

  constructor(size) {
    const geometry = new THREE.PlaneGeometry(size, size, 32);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('rgb(150, 0, 0)'),
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true
    });

    this.plane = new THREE.Mesh(geometry, material);
    // this.rotateOverY(THREE.Math.degToRad(180));
    // this.rotateOverZ(THREE.Math.degToRad(180));
    // this.rotateOverX(THREE.Math.degToRad(90));
  }

  rotateOverX = (degree) => {
    this.plane.rotateX(THREE.Math.degToRad(degree));
  };

  rotateOverY = (degree) => {
    this.plane.rotateY(THREE.Math.degToRad(degree));
  };

  rotateOverZ = (degree) => {
    this.plane.rotateZ(THREE.Math.degToRad(degree));
  };

  setX = (value) => {
    this.plane.position.x = value;
  };

  setY = (value) => {
    this.plane.position.y = value;
  };

  setZ = (value) => {
    this.plane.position.z = value;
  };

  draw = (scene) => {
    scene.add(this.plane);
  }
}
