import axios from "axios";

export default class PlansModel {
    getPlans() {
        axios.get('https://junction-planreview.azurewebsites.net').then(({data}) => data);
    }
}