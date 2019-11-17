import React, { PureComponent } from "react";
import "./Comparison.css";

const comparison = {
  Lung: {
    collectedData: ["Lung_Heart", "Lung_PTV_63", "Lung_Spinal_Cord"],
    countedData: ["Dose/MaxDose", "Dose/MinDose", "Dose/MeanDose"]
  }
};

class Comparison extends PureComponent {
  render() {
    return (
      <div>
        <h2 className="comparison__title">Comparison Lung</h2>
        <div className="comparison__images">
          {comparison.Lung.collectedData.map((tissueDependence, index) => (
            <img
              key={index}
              width="50%"
              className="comparison__image"
              alt={tissueDependence}
              src={`http://35.180.103.209/patients/Lung/comparisons/${tissueDependence}.png`}
            />
          ))}
        </div>
        <div className="comparison__images">
          {comparison.Lung.countedData.map((tissueDependence, index) => (
            <img
              key={index}
              width="50%"
              className="comparison__image"
              alt={tissueDependence}
              src={`http://35.180.103.209/patients/Lung/comparisons/${tissueDependence}.png`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Comparison;
