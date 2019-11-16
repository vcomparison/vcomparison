import React, {PureComponent} from "react";
import * as THREE from "three";
import * as TrackballControls from "three-trackballcontrols";
import {PLYLoader} from "./plyloader";
import BodyModel from "../../../models/BodyModel";
import Slicer from "./Slicer";
// import Model from "./Model";

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
    this.camera.position.set(0, -410, 170);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
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

  addModel = modelUrl => {
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
    this.addModel(
      `${this.baseModelsUrl}/patients/${patientId}/plans/${planId}` +
        `/isodose-meshes/${isodoseMeshId}`
    );
  };

  addOrgan = (patientId, imageId, structureMeshId) => {
    this.addModel(
      `${this.baseModelsUrl}/patients/${patientId}/images/${imageId}` +
        `/structure-meshes/${structureMeshId}`
    );
  };

  componentDidMount() {
    const { layerValue } = this.props;

    // mandatory
    this.initScene();
    this.initCamera();
    this.initCanvas();
    this.initControls();
    this.loader = new PLYLoader();

    // scene elements
    this.initAxis();
    this.initLight();

    this.drawPatient('Lung');

    // draw affected area
    // this.addTumor(patientId, planId, '73.500-Gy.ply');
    // this.addTumor(patientId, planId, '70.000-Gy.ply');
    // this.addTumor(patientId, planId, '35.000-Gy.ply');

    requestAnimationFrame(this.animate);
  }

  drawPatient = (patientId, layerValue) => {
    if (patientId === 'Head_Neck') {
      this.slicer = new Slicer(370);
      this.slicer.setX(10);
      this.slicer.setY(-100);
      this.slicer.setZ(layerValue);
      this.slicer.draw(this.scene);

      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Head_Neck/images/Study-1-Series-2-CT02/structure-meshes/Spinal-Cord');
      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Head_Neck/images/Study-1-Series-2-CT02/structure-meshes/BrainStem');
      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Head_Neck/images/Study-1-Series-2-CT02/structure-meshes/Body');
      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Head_Neck/images/Study-1-Series-2-CT02/structure-meshes/PTV56');

    } else if (patientId === 'Lung') {
      this.slicer = new Slicer(400);
      this.slicer.setX(0);
      this.slicer.setY(0);
      this.slicer.setZ(layerValue);
      this.slicer.draw(this.scene);

      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Lung/images/1622-Series-CT01/structure-meshes/Spinal-cord');
      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Lung/images/1622-Series-CT01/structure-meshes/Lung-right');
      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Lung/images/1622-Series-CT01/structure-meshes/Lung-left');
      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Lung/images/1622-Series-CT01/structure-meshes/Lung-GTV');
      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Lung/images/1622-Series-CT01/structure-meshes/Heart');
      this.addModel('https://junction-planreview.azurewebsites.net/api/patients/Lung/images/1622-Series-CT01/structure-meshes/Body');
    }
  };

  animate = () => {
    this.renderScene();
    this.frameId = requestAnimationFrame(this.animate);

    this.controls.update();
  };

  renderScene = () => {
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
