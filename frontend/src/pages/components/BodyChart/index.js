import React, { PureComponent } from "react";
import * as THREE from "three";
import * as TrackballControls from "three-trackballcontrols";
import { PLYLoader } from "./plyloader";
import BodyModel from "../../../models/BodyModel";
import Slicer from "./Slicer";

// import Model from "./Model";

class BodyChart extends PureComponent {
  chartContainer = React.createRef();
  state = { sliderValue: "0" };

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
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
    if (prevProps.patientId !== this.props.patientId)
      this.drawPatient(this.props.patientId, this.props.layerValue);
  }

  addModel = (modelUrl, colorStr, opacity) => {
    console.log(`loading model from ${modelUrl}`);
    this.loader.load(modelUrl, geometry => {
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorStr),
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

    this.models = [];
    this.drawPatient("Lung", 10);
    this.currentPatientId = "Lung";

    requestAnimationFrame(this.animate);
  }

  drawPatient = (patientId, layerValue) => {
    const bodyColor = "rgb(237, 171, 135)";

    if (patientId !== this.currentPatientId) {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
      this.initAxis();
      this.initLight();

      if (patientId === "Head_Neck") {
        this.currentPatientId = "Head_Neck";

        this.slicer = new Slicer(370);
        this.slicer.setX(10);
        this.slicer.setY(-100);
        this.slicer.setZ(0);
        this.slicer.draw(this.scene);

        // add organs
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Head_Neck/images/Study-1-Series-2-CT02/structure-meshes/Spinal-Cord",
          bodyColor,
          0
        );

        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Head_Neck/images/Study-1-Series-2-CT02/structure-meshes/BrainStem",
          bodyColor,
          0
        );
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Head_Neck/images/Study-1-Series-2-CT02/structure-meshes/PTV56",
          "rgb(0,0,0)",
          0.9
        );
        // add cancer
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Head_Neck/plans/JSu-IM101/isodose-meshes/35.000-Gy",
          "rgb(255, 0, 0)",
          0.9
        );
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Head_Neck/images/Study-1-Series-2-CT02/structure-meshes/Body",
          bodyColor,
          0.4
        );
      } else if (patientId === "Lung") {
        this.currentPatientId = "Lung";

        this.slicer = new Slicer(400);
        this.slicer.setX(0);
        this.slicer.setY(0);
        this.slicer.setZ(0);
        this.slicer.draw(this.scene);

        // add organs
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Lung/images/1622-Series-CT01/structure-meshes/Spinal-cord",
          bodyColor,
          0
        );
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Lung/images/1622-Series-CT01/structure-meshes/Lung-right",
          "rgb(135, 188, 204)",
          0.7
        );
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Lung/images/1622-Series-CT01/structure-meshes/Lung-left",
          "rgb(135, 188, 204)",
          0.7
        );
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Lung/images/1622-Series-CT01/structure-meshes/Lung-GTV",
          "rgb(0,0,0)",
          0.9
        );
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Lung/images/1622-Series-CT01/structure-meshes/Heart",
          "rgb(135, 188, 204)",
          0.7
        );
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Lung/images/1622-Series-CT01/structure-meshes/Body",
          bodyColor,
          0.3
        );

        // add cancer
        this.addModel(
          "https://junction-planreview.azurewebsites.net/api/" +
            "patients/Lung/plans/JSu-IM102/isodose-meshes/63.000-Gy",
          "rgb(255, 0, 0)",
          0.9
        );
      } else {
        console.log("unknown patient ", patientId);
        return;
      }

      // figures are the same
    } else {
      this.slicer.setZ(layerValue);
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
