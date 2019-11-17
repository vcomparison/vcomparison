import React, { PureComponent } from "react";
import { Button, Checkbox, Table } from "semantic-ui-react";
import _isEmpty from "lodash/isEmpty";
import PlansModel from "../../models/PlansModel";
import PatientsModel from "../../models/PatientsModel";
import "./Plans.css";

class Plans extends PureComponent {
  state = {
    comparingPlans: [],
    patients: [],
    plans: [],
    selectedPatient: "Lung",
    viewMode: "table",
    isLoaded: false
  };

  componentDidMount() {
    PatientsModel.getPatients()
      .then(patients => {
        this.setState({
          patients: patients.map(value => ({ value, text: value }))
        });
        this.fetchPlans();
      })
      .catch(() => this.setState({ patients: [], isLoaded: true }));
  }

  fetchPlans = () => {
    const { selectedPatient } = this.state;
    PlansModel.getPlans(selectedPatient)
      .then(({ Plans }) => {
        this.setState({
          plans: Plans.map(({ Id }) => ({ value: Id, text: Id }))
        });
        this.setState({ isLoaded: true });
      })
      .catch(() => this.setState({ isLoaded: true }));
  };

  onPlanSelect = event => {
    const { comparingPlans } = this.state;
    const clickedPlanText = event.currentTarget.textContent;
    if (comparingPlans.includes(clickedPlanText))
      return this.setState({
        comparingPlans: comparingPlans.filter(
          planText => planText !== clickedPlanText
        )
      });
    return this.setState({
      comparingPlans: [...comparingPlans, clickedPlanText]
    });
  };

  onComparePlan = () => {};

  onViewMode = viewMode => this.setState({ viewMode });

  render() {
    const { plans, comparingPlans, viewMode } = this.state;
    return (
      <div>
        <div>
          <Button
            onClick={this.onComparePlan}
            disabled={_isEmpty(comparingPlans)}
          >
            Compare plans
          </Button>
          <button type="button" onClick={() => this.onViewMode("table")}>
            Table view
          </button>
          <button type="button" onClick={() => this.onViewMode("details")}>
            Details view
          </button>
        </div>
        <div
          className={`plans__overview ${viewMode === "table" &&
            "plans__overview--table"}`}
        >
          <div>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Plans</Table.HeaderCell>
                  {viewMode === "table" && (
                    <Table.HeaderCell></Table.HeaderCell>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {plans.map(plan => (
                  <Table.Row
                    key={plan.value}
                    active={comparingPlans.includes(plan.value)}
                  >
                    <Table.Cell>
                      <Checkbox
                        name="comparingPlans"
                        label={plan.text}
                        className="plans__checkbox"
                        onChange={this.onPlanSelect}
                      />
                    </Table.Cell>
                    {viewMode === "table" && <Table.Cell>Cell</Table.Cell>}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          {viewMode === "details" && (
            <div className="plans__report">For details</div>
          )}
        </div>
      </div>
    );
  }
}

export default Plans;
