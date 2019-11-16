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
    const height = 300;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(200, 20, 200);
  };

  initCanvas = () => {
    const width = this.chartContainer.current.clientWidth;
    // FIXME set properly
    const height = 300;

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
    this.loader = new PLYLoader();

    // optional
    this.initAxis();
    this.initLight();


    // draw body
    this.addModel('cord.ply');
    this.addModel('BrainStem.ply');
    this.addModel('PTV56.ply');
    this.addModel('Body.ply');


    requestAnimationFrame(this.animate);
  }


  addModel = (modelName) => {
    this.loader.load(`http://localhost:5000/models/${modelName}`, (geometry) => {
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
      const mesh = new THREE.Mesh(geometry, material);

      this.scene.add(mesh);
    });
  };

  componentWillUnmount() {
    this.stop();
    this.chartContainer.current.removeChild(this.renderer.domElement);
  }

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
