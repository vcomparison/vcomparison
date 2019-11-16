import React, { PureComponent, Fragment } from "react";
import { Dropdown } from "semantic-ui-react";
import PlansModel from "../models/PlansModel";
import PatientsModel from "../models/PatientsModel";
import VoxelChart from "./components/VoxelChart";
import "./App.css";

class App extends PureComponent {
  baseUrl = "https://junction-planreview.azurewebsites.net";
  canvas = React.createRef();
  layerSlider = React.createRef();

  state = {
    layerValue: "1",
    filters: {
      patients: "Lung"
    },
    options: {},
    isLoaded: false
  };

  componentDidMount() {
    PatientsModel.getPatients()
      .then(patients => {
        this.setState({
          options: { patients: patients.map(value => ({ value, text: value })) }
        });
        this.fetchPlans();
      })
      .catch(() =>
        this.setState({ options: { patients: [] }, isLoaded: true })
      );
    this.loadImageToCanvas();
  }

  fetchPlans = () => {
    const {
      filters: { patients },
      options
    } = this.state;
    PlansModel.getPlans(patients)
      .then(({ Plans }) => {
        this.setState({
          options: {
            ...options,
            plans: Plans.map(({ Id }) => ({ value: Id, text: Id }))
          }
        });
        this.setState({ isLoaded: true });
      })
      .catch(() => this.setState({ isLoaded: true }));
  };

  onPlanChange = ({ target }) => {
    const { filters } = this.state;
    const planId = target.textContent;
    if (filters.plans === planId) return null;
    this.setState({ filters: { ...filters, plans: planId } }, () =>
      this.loadImageToCanvas()
    );
  };

  loadImageToCanvas = () => {
    const { layerValue, filters } = this.state;
    const canvas = this.canvas.current;
    var context = canvas.getContext("2d");

    var imageObj = new Image();

    var imageUrl = `${this.baseUrl}/api/patients/${filters.patients}/plans/${filters.plans}/RenderedBitmaps/`;
    imageObj.src = imageUrl + layerValue;

    imageObj.onload = function() {
      context.drawImage(this, 0, 0);
    };
  };

  onLayerChange = ({ target: { value } }) => {
    this.setState({ layerValue: value }, () => this.loadImageToCanvas());
  };

  onPatientChange = ({ target }) => {
    const { filters, options } = this.state;
    const value = target.textContent;
    if (filters.patients === value) return null;
    this.setState(
      {
        filters: { patients: value, plans: null },
        options: { ...options, plans: [] }
      },
      () => this.fetchPlans()
    );
  };

  render() {
    const { layerValue, filters, options, isLoaded } = this.state;
    return (
      <div className="container">
        <div>
          {isLoaded && (
            <div className="filters">
              <Dropdown
                selection
                options={options.patients}
                value={filters.patients}
                onChange={this.onPatientChange}
              />
              {options.plans && (
                <Dropdown
                  selection
                  options={options.plans}
                  value={filters.plans}
                  onChange={this.onPlanChange}
                />
              )}
            </div>
          )}
          <div
            style={
              options.plans && options.plans.length > 0
                ? { width: "600px" }
                : { width: 0 }
            }
          >
            <canvas ref={this.canvas} width="600" height="600"></canvas>
          </div>
          <div>
            <input
              type="range"
              min="1"
              max="100"
              value={layerValue}
              ref={this.layerSlider}
              onChange={this.onLayerChange}
            ></input>
          </div>
          {/* <VoxelChart /> */}
        </div>
      </div>
    );
  }
}

export default App;
