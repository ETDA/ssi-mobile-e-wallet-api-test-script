import axios from 'axios'
import { AUTHORIZATION, CONFIG } from '../../consts'
import { CryptoHelper } from '../../utils/ecdsa-CryptoHelper'

const genSignature = (private_key: string, didAddress: any) => {
  return {
    headers: {
      'x-signature': CryptoHelper.sign(private_key, didAddress)
    }
  }
}

export class MobileInfo {

  static async GetUserId (didAddress: string, didKey: any, didUrl: string) {
    const res = genSignature(didKey[0].private_key, didAddress)
    console.log('Signature: ', JSON.stringify(res.headers, null, 2))
    return await axios.get(`${CONFIG.MOBILE_URL}/api/mobile/users/${didUrl}`,
      { headers: res.headers })
  }

  static async GetMobileStatus () {
    return await axios.get(`${CONFIG.MOBILE_URL}/api/mobile/status`,
      { headers: { 'Authorization': `FINEMA ${AUTHORIZATION.MOBILE_TOKEN}` } })
  }

  static async GetMobileUser () {
    return await axios.get(`${CONFIG.MOBILE_URL}/api/mobile/users`,
      { headers: { 'Authorization': `FINEMA ${AUTHORIZATION.MOBILE_TOKEN}` } })
  }

  static async GetMobileUserByDID (didAddress: string) {
    return await axios.get(`${CONFIG.MOBILE_URL}/api/mobile/users/did_address/${didAddress}`,
      { headers: { 'Authorization': `FINEMA ${AUTHORIZATION.MOBILE_TOKEN}` } })
  }

  static async GetMobileUserInfoByDID (didAddress: string,didKey: any, didUrl: string) {
    const res = genSignature(didKey[0].private_key, didAddress)
    console.log('Signature: ', JSON.stringify(res.headers, null, 2))
    return await axios.get(`${CONFIG.MOBILE_URL}/api/mobile/users/${didUrl}`,
      { headers: res.headers })
  }
}
