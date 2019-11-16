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
  }

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
