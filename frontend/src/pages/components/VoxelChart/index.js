import React from "react";
const Voxelizer = require("voxelizer");
const voxelizer = new Voxelizer();

let path3DModel = "./data.obj";

const VoxelChart = () => {
  const elem = voxelizer.loadOBJ(path3DModel);
console.log(elem)
  elem.then(object => {
    const resolution = 10;
    console.log(voxelizer);
    let matrix = voxelizer.sample(object, resolution);
    console.log("matrix", matrix);
  });

  return <div>Voxel</div>;
};

export default VoxelChart;
