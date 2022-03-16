import axios from 'axios'
import { CONFIG } from '../../consts'

const genUpdateTokenMessage = (obj: {
  did_address: string, uuid: string, token: string
}) => {
  return {
    did_address: obj.did_address,
    uuid: obj.uuid,
    token: obj.token
  }
}

export class Token {

  static async Update(didAddress: string, uuid: string, token: string, uuidInUrl: string) {
    const message = genUpdateTokenMessage({
      did_address: didAddress,
      uuid: uuid,
      token: token
    })
    console.log('request: Token update ', JSON.stringify(message, null, 2))
    return await axios.put(`${CONFIG.BASE_URL}/api/mobile/devices/${uuidInUrl}/token`, message)
  }
}
