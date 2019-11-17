import React, { PureComponent } from "react";

const comparison = {
  Lung: ["Lung_Heart", "Lung_PTV_63", "Lung_Spinal_Cord"]
};

class Comparison extends PureComponent {
  render() {
    return (
      <div>
        <h2>Comparison Lung</h2>
        {comparison.Lung.map((tissueDependence, index) => (
          <div key={index}>
            <img
              width="60%"
              alt={tissueDependence}
              src={`http://35.180.103.209/patients/Lung/comparisons/${tissueDependence}.png`}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default Comparison;
