import React, {PureComponent} from "react";
import * as THREE from "three";
import * as TrackballControls from "three-trackballcontrols";
import {PLYLoader} from "./plyloader";
import BodyModel from '../../../models/BodyModel';

class BodyChart extends PureComponent {
  chartContainer = React.createRef();
  state = {sliderValue: "0"};

  initScene = () => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);
  };

  initCamera = () => {
    const width = this.chartContainer.current.clientWidth;
    // FIXME set properly
    const height = 200;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(200, 20, 200);
  };

  initCanvas = () => {
    const width = this.chartContainer.current.clientWidth;
    // FIXME set properly
    const height = 200;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    // appending renderer as canvas
    this.chartContainer.current.appendChild(this.renderer.domElement);
  };

  initControls = () => {
    this.controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.addEventListener("change", this.renderScene);
  };

  componentDidMount() {
    // mandatory
    this.initScene();
    this.initCamera();
    this.initCanvas();
    this.initControls();

    // optional
    this.initAxis();
    this.initLight();

    let loader = new PLYLoader();

    const scene_ = this.scene;

    loader.load(`http://localhost:5000/models/Body.ply`, function (geometry) {
      geometry.computeVertexNormals();

      const color = new THREE.Color(0xffffff);
      color.setHex(Math.random() * 0xffffff);

      const material = new THREE.MeshStandardMaterial({
        color: color,
        flatShading: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.rotateX(THREE.Math.degToRad(45));

      scene_.add(mesh);
    });

    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.chartContainer.current.removeChild(this.renderer.domElement);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  initAxis = () => {
    const axesHelper = new THREE.AxesHelper(50);
    this.scene.add(axesHelper);
  };

  initLight = () => {
    const light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(1, 1, 1);
    this.scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(1, -1, 0);
    this.scene.add(light2);
  };

  animate = () => {
    this.renderScene();
    this.frameId = requestAnimationFrame(this.animate);

    this.controls.update();
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  toggleAngle = () => {
  };

  render() {
    const {sliderValue} = this.state;
    return (
      <div>
        <input
          type="range"
          min="0"
          max="360"
          step="10"
          value={sliderValue}
          onChange={this.toggleAngle}
        ></input>
        <div ref={this.chartContainer}></div>
      </div>
    );
  }
}

export default BodyChart;
