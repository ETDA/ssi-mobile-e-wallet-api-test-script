import axios from 'axios'
import { CONFIG } from '../../consts'
import { CryptoHelper } from '../../utils/rsa-CrytoHelper'

const genUpdateDIdMessage = (obj: {
  id: string, did_address: string
}) => {
  return {
    id: obj.id,
    did_address: obj.did_address
  }
}

const genRequestData = (private_key: string, message: any) => {
  const messageData = CryptoHelper.encodeBase64(JSON.stringify(message))
  return {
    data: {
      message: messageData
    },
    headers: {
      'x-signature': CryptoHelper.sign(private_key, messageData)
    }
  }
}

export class UserDID {

  static async Update (didAddress:string, userId: string, didKey: any, userIdInUrl: string) {
    const message = genUpdateDIdMessage({
      id: userId,
      did_address: didAddress,
    })
    const res = genRequestData(didKey[0].private_key, message)
    console.log('request: Update user DID',JSON.stringify(message,null, 2))
    console.log('headers: Update user DID',JSON.stringify(res.headers,null, 2))
    console.log('body: Update user DID',JSON.stringify(res.data,null, 2))
    return await axios.put(`${CONFIG.MOBILE_URL}/api/mobile/users/${userIdInUrl}`,
      res.data, { headers: res.headers })
  }
}
