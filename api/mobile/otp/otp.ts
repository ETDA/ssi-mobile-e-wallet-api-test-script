import axios from 'axios'
import { CONFIG } from '../../consts'

export class OTP {

  static async Send (userId: string) {
    return await axios.post(`${CONFIG.MOBILE_URL}/api/mobile/users/${userId}/otp`)
  }

  static async Get (userId: string) {
    return await axios.get(`${CONFIG.MOBILE_URL}/api/mobile/users/${userId}/otps`)
  }

  static async Confirm (userId: string, otp:string) {
    let body = {
      otp_number: otp
    }
    return await axios.post(`${CONFIG.MOBILE_URL}/api/mobile/users/${userId}/otp/confirm`,
      body)
  }

  static async Resend (userId: string) {
    return await axios.post(`${CONFIG.MOBILE_URL}/api/mobile/users/${userId}/otp/resend`)
  }
}
