import axios from "axios";

const baseUrl = "https://junction-planreview.azurewebsites.net";

export default class PlansModel {
  static getPlans(patientId) {
    return axios
      .get(`${baseUrl}/api/patients/${patientId}`)
      .then(({ data }) => data);
  }
}
