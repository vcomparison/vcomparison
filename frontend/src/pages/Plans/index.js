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

  render() {
    const { plans, comparingPlans } = this.state;
    return (
      <div>
        <div>
          <Button
            onClick={this.onComparePlan}
            disabled={_isEmpty(comparingPlans)}
          >
            Compare plans
          </Button>
        </div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Plans</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
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
                <Table.Cell>Cell</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Plans;
