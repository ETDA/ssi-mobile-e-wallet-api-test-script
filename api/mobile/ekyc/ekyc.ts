import axios from 'axios'
import { CONFIG } from '../../consts'

export const ID_INFO = {
  DATE_OF_BIRTH: {
    CORRECT: '6 มี.ค. 2537',
    INCORRECT: ''
  },
  LASER_ID: {
    CORRECT: 'JT3-1031897-60',
    INCORRECT: ''
  },
  EMAIL: {
   CORRECT: 'test@finema.co',
    INCORRECT: ''
  }
}

const genIdInfoMessage = (obj: {
  id_card_no: string, first_name: string, last_name: string, date_of_birth: string, laser_id: string
}) => {
  return {
    id_card_no: obj.id_card_no,
    first_name: obj.first_name,
    last_name: obj.last_name,
    date_of_birth: obj.date_of_birth,
    laser_id: obj.laser_id
  }
}

export class Ekyc {

  static async idInfo (idCardNo: string, firstName: string, lastName: string, dateOfBirth: string, laserId: string) {
    const message = genIdInfoMessage({
      id_card_no: idCardNo,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      laser_id: laserId
    })
    console.log('request: ID Card info ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/mobile/ekyc`, message)
  }
}
