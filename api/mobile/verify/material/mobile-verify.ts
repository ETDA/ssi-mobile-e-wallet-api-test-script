import { CONFIG, OPERATION } from '../../../consts'
import { CryptoHelper } from '../../../utils/rsa-CrytoHelper'
import axios from 'axios'

const genPostVerifyRequest = (obj: {
  jwt: string, did_address: string,
}) => {
  return {
    jwt: obj.jwt,
    did_address: obj.did_address,
    operation: OPERATION.REQUEST_VERIFY
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

export class PostVerify {

  static async Mobile (jwtVp: string, didAddress:string,didKey: any) {
    const message = genPostVerifyRequest({
      jwt: jwtVp,
      did_address:didAddress,
    })
    const res = genRequestData(didKey[0].private_key, message)
    console.log('request: Post verify', JSON.stringify(message, null, 2))
    console.log('headers: Post verify', JSON.stringify(res.headers, null, 2))
    console.log('body: Post verify', JSON.stringify(res.data, null, 2))
    return await axios.post(`${CONFIG.BASE_URL}/api/mobile/verify`,
      res.data, { headers: res.headers })
  }
}
