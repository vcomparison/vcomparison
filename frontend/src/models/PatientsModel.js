import axios from "axios";

const baseUrl = "https://junction-planreview.azurewebsites.net";

export default class PatientsModel {
  static getPatients() {
    return axios.get(`${baseUrl}/api/patients`).then(({ data }) => data);
  }
}
