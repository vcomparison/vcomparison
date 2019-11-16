import React, { PureComponent } from "react";
import { Checkbox, Table } from "semantic-ui-react";
import PlansModel from "../../models/PlansModel";
import PatientsModel from "../../models/PatientsModel";
import "./Plans.css";

class Plans extends PureComponent {
  state = {
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

  render() {
    const { plans } = this.state;
    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Plans</Table.HeaderCell>
              <Table.HeaderCell>Header</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {plans.map(plan => (
              <Table.Row key={plan.value}>
                <Table.Cell>
                  <Checkbox
                    name="comparingPlan"
                    label={plan.text}
                    className="plans__checkbox"
                    onChange={() => {}}
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
