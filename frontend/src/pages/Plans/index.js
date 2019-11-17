import React, { PureComponent } from "react";
import { Button, Checkbox, Dropdown, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import PlansModel from "../../models/PlansModel";
import PatientsModel from "../../models/PatientsModel";
import "./Plans.sass";

class Plans extends PureComponent {
  state = {
    selectedPlan: "",
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
    this.setState({ selectedPlan: event.currentTarget.textContent });
  };

  onPatientChange = ({ target }) => {
    const value = target.textContent;
    this.setState({ selectedPatient: value }, () => this.fetchPlans());
  };

  onComparePlan = () => {};

  onViewMode = viewMode => this.setState({ viewMode });

  render() {
    const {
      plans,
      patients,
      selectedPlan,
      selectedPatient,
      viewMode
    } = this.state;
    return (
      <div>
        <div className="plans__link-wrapper">
          <Link to="/comparison">
            <Button onClick={this.onComparePlan}>Compare plans</Button>
          </Link>
        </div>
        <div className="plans__patient-dropdown">
          <Dropdown
            selection
            options={patients}
            value={selectedPatient}
            onChange={this.onPatientChange}
          />
          <div>
            <Button onClick={() => this.onViewMode("table")}>Table view</Button>
            <Button onClick={() => this.onViewMode("details")}>
              Details view
            </Button>
          </div>
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
                    active={selectedPlan === plan.value}
                  >
                    <Table.Cell>
                      <Checkbox
                        radio
                        name="selectedPlan"
                        label={plan.text}
                        className="plans__checkbox"
                        onChange={this.onPlanSelect}
                        checked={selectedPlan === plan.value}
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
