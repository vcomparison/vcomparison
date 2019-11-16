import React, { PureComponent, Fragment } from "react";
import { Dropdown, Button } from "semantic-ui-react";
import { Switch, Route } from "react-router";
import PlansModel from "../models/PlansModel";
import PatientsModel from "../models/PatientsModel";
import VoxelChart from "./components/VoxelChart";
import "./App.sass";
import BodyChart from "./components/BodyChart";
import CommentArea from "./components/CommentArea";
import Header from "./components/Header";
import Plans from "./Plans";

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
    isLoaded: false,
    isFirstlyLoaded: false,
    isCommentBlockOpen: false
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
    const canvas = this.canvas.current;
    var context = canvas.getContext("2d");
    context.scale(0.8, 0.8);
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
    const { layerValue, filters, isFirstlyLoaded } = this.state;
    const canvas = this.canvas.current;
    var context = canvas.getContext("2d");
    if (!isFirstlyLoaded) {
      this.setState({ isFirstlyLoaded: true });
      context.scale(0.9, 0.9);
    }

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

  onToggleComment = () => {
    const { isCommentBlockOpen } = this.state;
    this.setState({
      isCommentBlockOpen: !isCommentBlockOpen
    });
  };

  render() {
    const {
      layerValue,
      filters,
      options,
      isLoaded,
      isCommentBlockOpen
    } = this.state;
    const currentMetadata = { layerValue, plan: filters.plans };
    return (
      <div>
        <div className="app__header-wrapper">
          <div className="container">
            <Header />
          </div>
        </div>
        <div className="app__page-content">
          <div className="container">
            <Switch>
              <Route path="/plans">
                <Plans />
              </Route>
            </Switch>
            {/* <Plans /> */}
            <div className="row">
              <div className="col-xs-6">
                <div className="app__layer-slider-container">
                  <div className="app__layer-slider-label">Layer value</div>
                  <input
                    type="range"
                    min="-100"
                    max="150"
                    value={layerValue}
                    ref={this.layerSlider}
                    onChange={this.onLayerChange}
                  ></input>
                </div>
              </div>
              <div className="col-xs-6">
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
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <div className="app__block">
                  <BodyChart layerValue={layerValue} />
                </div>
              </div>
              <div className="col-xs-6">
                <div className="app__block">
                  <div>
                    <div
                      style={
                        options.plans && options.plans.length > 0
                          ? { width: "394px" }
                          : { width: 0 }
                      }
                    >
                      <canvas
                        ref={this.canvas}
                        width="394"
                        height="394"
                      ></canvas>
                    </div>
                    {/* <VoxelChart /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`app__comment-block ${
            isCommentBlockOpen ? "app__comment-block--opened" : ""
          }`}
        >
          <CommentArea />
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="32px"
            viewBox="0 0 1000 1000"
            className="app__comment-icon"
            onClick={this.onToggleComment}
          >
            <g>
              <path d="M395,185c-55.8,0-107.9,9.5-156.4,28.4c-48.5,18.9-87,44.6-115.7,77.1C94.3,322.9,80,357.8,80,394.9c0,29.9,9.7,58.7,29,86.4c19.3,27.7,46.5,51.8,81.5,72.2l53.1,30.6l-19.1,46c12.4-7.3,23.7-14.4,33.9-21.3l24.1-16.9l29,5.5c28.4,5.1,56.3,7.7,83.7,7.7c55.8,0,107.9-9.5,156.4-28.4c48.5-18.9,87-44.6,115.7-77.1C695.7,467,710,432.2,710,395s-14.3-72-42.9-104.4c-28.6-32.5-67.2-58.2-115.7-77.1c-48.5-18.9-100.6-28.4-156.4-28.4V185z M395,115c69.6,0,134.1,12.5,193.3,37.5s106,59,140.3,102c34.3,43,51.4,89.9,51.4,140.6c0,50.7-17.1,97.5-51.4,140.6c-34.3,43-81,77-140.3,102C529.1,662.5,464.6,675,395,675c-31.4,0-63.4-2.9-96.3-8.8c-45.2,32.1-95.9,55.4-152,70c-13.1,3.3-28.8,6.2-47,8.7H98c-4,0-7.7-1.5-11.2-4.4c-3.5-2.9-5.6-6.7-6.3-11.5c-0.4-1.1-0.6-2.3-0.6-3.6s0.1-2.5,0.3-3.6c0.2-1.1,0.5-2.2,1.1-3.3l1.4-2.7c0,0,0.6-1,1.9-3c1.3-2,2-2.9,2.2-2.7c0.2,0.2,1-0.7,2.5-2.7c1.4-2,2.2-2.8,2.2-2.5c1.8-2.2,6-6.8,12.6-13.7c6.6-6.9,11.3-12.3,14.2-16.1c2.9-3.8,7-9.1,12.3-15.9c5.3-6.7,9.9-13.8,13.7-21.1s7.6-15.3,11.2-24.1c-45.2-26.3-80.7-58.5-106.6-96.8C22.9,479.1,10,438.3,10,394.9c0-50.7,17.1-97.5,51.4-140.6c34.3-43,81-77,140.3-102C260.9,127.4,325.4,114.9,395,115L395,115z M844.5,754.3c3.6,8.8,7.4,16.8,11.2,24.1c3.8,7.3,8.4,14.3,13.7,21.1c5.3,6.7,9.4,12,12.3,15.9c2.9,3.8,7.7,9.2,14.2,16.1c6.6,6.9,10.7,11.5,12.6,13.7c0.4,0.4,1.1,1.2,2.2,2.5c1.1,1.3,1.9,2.2,2.4,2.7c0.5,0.6,1.3,1.5,2.2,2.7c0.9,1.3,1.6,2.3,1.9,3l1.4,2.7c0,0,0.4,1.1,1.1,3.3c0.7,2.2,0.8,3.4,0.3,3.6c-0.5,0.2-0.7,1.4-0.6,3.6c-1.1,5.1-3.5,9.1-7.1,12c-3.6,2.9-7.7,4.2-12,3.8c-18.2-2.5-33.9-5.5-47-8.8c-56.1-14.6-106.8-37.9-152-70c-32.8,5.8-64.9,8.8-96.2,8.8c-98.8,0-184.8-24.1-258.1-72.2c21.1,1.5,37.2,2.2,48.1,2.2c58.7,0,115-8.2,169-24.6c53.9-16.4,102.1-39.9,144.4-70.6c45.6-33.5,80.6-72.2,105-116C837.8,490.1,850,443.8,850,395c0-28.1-4.2-55.8-12.6-83.1c47,25.9,84.2,58.3,111.5,97.3c27.3,39,41,80.9,41,125.8c0,43.8-12.9,84.7-38.8,122.8C925.3,695.9,889.8,728.1,844.5,754.3L844.5,754.3z" />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
