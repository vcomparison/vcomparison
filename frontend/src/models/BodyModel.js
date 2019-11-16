/**
 * Created by anthony on 16/11/2019.
 */

import axios from 'axios';

export default class BodyModel {
  static getData(bodyElem) {
    return axios.get(`http://localhost:5000/models/${bodyElem}`).then(({data}) => data)
  }
}
