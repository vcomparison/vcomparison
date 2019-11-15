import React, { PureComponent } from "react";
import { Dropdown } from 'semantic-ui-react';
import '../models/PlansModel';

class App extends PureComponent {
  baseUrl = 'https://junction-planreview.azurewebsites.net';
  canvas = React.createRef();
  layerSlider = React.createRef();

  state = {
    layerValue: "1",
    filters: {
      patients: 'Lung'
    },
    options: {
      patients: [
        {value: "Abdomen",text: "Abdomen"},
        {value: "Head_Neck",text: "Head_Neck"},
        {value: "Lung",text: "Lung"},
        {value: "Prostate", text: "Prostate"}
      ]
    }
  };

  componentDidMount() {
    this.loadImageToCanvas();
  }

  loadImageToCanvas = () => {
    const { layerValue } = this.state;
    const canvas = this.canvas.current;
    var context = canvas.getContext("2d");

    var imageObj = new Image();

    var imageUrl =
      `${this.baseUrl}/api/patients/Head_Neck/plans/JSu-IM101/RenderedBitmaps/`;
    imageObj.src = imageUrl + layerValue;

    imageObj.onload = function() {
      context.drawImage(this, 0, 0);
    };
  };

  onLayerChange = ({ target: { value } }) => {
    this.setState({ layerValue: value }, () => this.loadImageToCanvas());
  };

  render() {
    const { layerValue, filters, options } = this.state;
    return (
      <div className="container">
        <Dropdown selection options={options.patients} value={filters.patients} />
        <div>
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
      </div>
    );
  }
}

export default App;
