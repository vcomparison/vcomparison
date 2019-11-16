import React, { PureComponent } from "react";
import * as d3 from "d3";
import _isEmpty from "lodash/isEmpty";
import PlansModel from "../../../models/PlansModel";
import "./LinearChart.css";

class LinearChart extends PureComponent {
  chart = React.createRef();

  state = {
    chart: {
      coordinates: [
        { x: 1, y: 0.23252920379179587 },
        { x: 2, y: 0.007189240787434992 },
        { x: 3, y: 0.63738961214362 },
        { x: 4, y: 0.8211771774880101 },
        { x: 5, y: 0.7232402303291179 },
        { x: 6, y: 0.7744282099269493 },
        { x: 7, y: 0.7083177315996128 },
        { x: 8, y: 0.6780419193687295 },
        { x: 9, y: 0.06304336008173861 },
        { x: 10, y: 0.942215835913742 },
        { x: 11, y: 0.14185139782555956 },
        { x: 12, y: 0.8369987025520775 },
        { x: 13, y: 0.09048448746824156 },
        { x: 14, y: 0.21310913184834535 },
        { x: 15, y: 0.8062190933922233 },
        { x: 16, y: 0.21951338688170052 },
        { x: 17, y: 0.24635193183855297 },
        { x: 18, y: 0.2750194376663091 },
        { x: 19, y: 0.8573557893047405 },
        { x: 20, y: 0.6400213533856416 },
        { x: 21, y: 0.20045951565174258 }
      ],
      xAxis: "X axis",
      yAxis: "Y axis"
    }
  };

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  fetchChartData = (patient, plan) => {
    PlansModel.getDVH(patient, plan).then(data => console.log(data));
  };

  drawChart = () => {
    const { patient, plan } = this.props;
    const {
      chart: { coordinates, xAxis, yAxis }
    } = this.state;
    const margin = { top: 50, right: 50, bottom: 50, left: 70 };
    const width = 660 - margin.left - margin.right;
    const height = 310 - margin.top - margin.bottom;

    if (!_isEmpty(plan)) this.fetchChartData(patient, plan);

    d3.select(this.chart.current)
      .selectAll("*")
      .remove();

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(coordinates.map(coordinate => coordinate.x)))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(coordinates.map(coordinate => coordinate.y)))
      .range([height, 0]);

    const line = d3
      .line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    const svg = d3
      .select(this.chart.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));

    svg
      .append("path")
      .datum(coordinates)
      .attr("class", "line")
      .attr("d", line);

    svg
      .selectAll(".dot")
      .data(coordinates)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5);

    svg
      .append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top})`)
      .style("text-anchor", "middle")
      .text(xAxis);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yAxis);
  };

  render() {
    return (
      <div>
        <div className="linear-chart">
          <div>
            <h2 className="linear-chart__title">LinearChart</h2>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" ref={this.chart} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LinearChart;
