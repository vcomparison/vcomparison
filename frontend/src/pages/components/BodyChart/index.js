import React, { PureComponent } from "react";
import * as THREE from "three";
import * as PLYLoader from "three-ply-loader";

let controls;

class BodyChart extends PureComponent {
  chartContainer = React.createRef();
  state = { sliderValue: "0" };

  componentDidMount() {
    // let loader = new THREE.PLYLoader();

    // Add scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);

    // Add camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(200, 20, 200);

    // Add renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // appending renderer as canvas
    this.chartContainer.current.appendChild(this.renderer.domElement);

    //ADD CUBE
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#433F81" });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.start();

    // initControls();

    // optional
    this.initAxis();
    this.initLight();

    this.animate();

    // function addFigure() {
    //   const submitter = document.getElementsByClassName(
    //     "control-element__file"
    //   )[0];
    //   if (0 === submitter.files.length) {
    //     console.log("Nothing to submit!");
    //     return;
    //   }

    //   const file = submitter.files[0];

    //   if (file) {
    //     console.log(`loading file ${file.name}`);

    //     loader.load("./js/models/" + file.name, function(geometry) {
    //       geometry.computeVertexNormals();

    //       const color = new THREE.Color(0xffffff);
    //       color.setHex(Math.random() * 0xffffff);

    //       const material = new THREE.MeshStandardMaterial({
    //         color: color,
    //         flatShading: true,
    //         side: THREE.DoubleSide
    //       });
    //       const mesh = new THREE.Mesh(geometry, material);

    //       mesh.rotateX(THREE.Math.degToRad(45));

    //       this.scene.add(mesh);
    //     });
    //   }
    // }
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };
  //   initControls = () => {
  //     controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
  //     controls.addEventListener("change", render);
  //   };

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

  //   animate = () => {
  //     // requestAnimationFrame(animate);

  //     // controls.update();

  //     this.renderScene();
  //   };

  //   renderScene() {
  //     this.renderer.render(this.scene, this.camera);
  //   }

  toggleAngle = () => {};

  render() {
    const { sliderValue } = this.state;
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
