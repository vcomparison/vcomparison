import React, {PureComponent} from "react";
import * as THREE from "three";
import * as TrackballControls from "three-trackballcontrols";
import {PLYLoader} from "./plyloader";
import BodyModel from "../../../models/BodyModel";
import Slicer from "./Slicer";

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
    const height = 394;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(200, 20, 200);
  };

  initCanvas = () => {
    const width = this.chartContainer.current.clientWidth;
    // FIXME set properly
    const height = 394;

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

  componentDidUpdate(prevState, prevProps) {
    if (prevProps.layerValue !== this.props.layerValue)
      this.slicer.setZ(this.props.layerValue);
  }

  addModel = (modelUrl) => {
    console.log(`loading model from ${modelUrl}`);
    this.loader.load(modelUrl, geometry => {
      geometry.computeVertexNormals();

      const color = new THREE.Color(0xffffff);
      color.setHex(Math.random() * 0xffffff);

      const opacityMin = 0.3;
      const opacityMax = 0.8;
      const opacity = (
        Math.random() * (opacityMax - opacityMin) +
        opacityMin
      ).toFixed(4);

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

  addTumor = (patientId, planId, isodoseMeshId) => {
    this.addModel(`${this.baseModelsUrl}/patients/${patientId}/plans/${planId}` +
      `/isodose-meshes/${isodoseMeshId}`);
  };

  addOrgan = (patientId, imageId, structureMeshId) => {
    this.addModel(`${this.baseModelsUrl}/patients/${patientId}/images/${imageId}` +
      `/structure-meshes/${structureMeshId}`);
  };

  // FIXME enable raycasting
  // onMouseMove = (event) => {
  //   // calculate mouse position in normalized device coordinates
  //   // (-1 to +1) for both components
  //   console.log('event: ', event.clientX, event.clientY);
  //
  //   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //
  //   console.log('mouse: ', this.mouse.x, this.mouse.y);
  // };

  onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

  };

  componentDidMount() {
    const {layerValue} = this.props;

    // mandatory
    this.initScene();
    this.initCamera();
    this.initCanvas();
    window.addEventListener('resize', this.onWindowResize, false);
    this.initControls();

    this.loader = new PLYLoader();
    // FIXME enable raycasting
    // this.raycaster = new THREE.Raycaster();
    // this.mouse = new THREE.Vector2();
    // window.addEventListener('mousemove', this.onMouseMove, false);

    // scene elements
    this.initAxis();
    this.initLight();

    this.baseModelsUrl = 'http://localhost:5000';

    // slice body into halves
    // FIXME relative to body's origin position and size
    this.slicer = new Slicer(230);
    this.slicer.setX(10);
    this.slicer.setY(-100);
    this.slicer.setZ(layerValue);
    this.slicer.draw(this.scene);

    // draw body
    const patientId = 'Head_Neck';
    const imageId = 'Study-1-Series-2-CT02';
    this.addOrgan(patientId, imageId, "cord.ply");
    // this.addOrgan(patientId, imageId, "BrainStem.ply");
    // this.addOrgan(patientId, imageId, "PTV56.ply");
    // this.addOrgan(patientId, imageId, "Body.ply");

    // draw affected area
    const planId = 'JSu-IM102';
    // this.addTumor(patientId, planId, '73.500-Gy.ply');
    // this.addTumor(patientId, planId, '70.000-Gy.ply');
    this.addTumor(patientId, planId, '35.000-Gy.ply');

    requestAnimationFrame(this.animate);
  }

  animate = () => {
    this.renderScene();
    this.frameId = requestAnimationFrame(this.animate);

    this.controls.update();
  };

  renderScene = () => {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // FIXME enable raycasting
    // const intersects = this.raycaster.intersectObjects(this.scene.children);
    //
    // // all blue
    // this.scene.children.forEach((child) => {
    //   if (child.type === 'Mesh') {
    //     child.material.color.set('rgb(0, 0, 220)');
    //   }
    // });
    //
    // // intersected is red
    // // console.log('intersection : ' + intersects);
    // for (let i = 0; i < intersects.length; i++) {
    //   intersects[i].object.material.color.set(0xff0000);
    // }

    this.renderer.render(this.scene, this.camera);
  };

  componentWillUnmount() {
    this.stop();
    this.chartContainer.current.removeChild(this.renderer.domElement);
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  render() {
    return (
      <div>
        <div ref={this.chartContainer}></div>
      </div>
    );
  }
}

export default BodyChart;
