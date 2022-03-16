import axios from 'axios'
import { CONFIG } from '../../consts'

const genLoginMessage = (obj: {
  user_name: string, password: string
}) => {
  return {
    email: obj.user_name,
    password: obj.password
  }
}

export class Authen {

  static async Login (userName: string, password: string) {
    const message = genLoginMessage({
      user_name: userName,
      password: password
    })
    console.log('request: Login ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/web/login`, message)
  }
}
