import axios from 'axios'
import { AUTHORIZATION, CONFIG } from '../../consts'

const genNotificationSendMessage = (obj: {
  did_address: string, title: string, body: string, priority: string, cid: string
  data_title: string, data_body: string, jwtVC: string
}) => {
  return {
    did_address: obj.did_address,
    notifications: [
      {
        title: obj.title,
        body: obj.body,
        image_url: '',
        category: '',
        icon: '',
        click_action: '',
        sound: '',
        priority: obj.priority,
        data: {
          title: obj.data_title,
          body: obj.data_body,
          message: obj.jwtVC,
          approve_endpoint: `https://ssi-test.teda.th/api/web/vcs/${obj.cid}/approve`,
          reject_endpoint: `https://ssi-test.teda.th/api/web/vcs/${obj.cid}/reject`
        }
      }
    ]
  }
}

export class Notification {
  static async Send (didAddress: string, title: string, body: string,
    priority: string, cid: string, dataTitle: string, dataBody: string, jwtVC: string) {
    const message = genNotificationSendMessage({
      did_address: didAddress,
      title: title,
      body: body,
      priority: priority,
      cid: cid,
      data_title: dataTitle,
      data_body: dataBody,
      jwtVC: jwtVC
    })
    console.log('request: Send request',JSON.stringify(message,null, 2))
    return await axios.post(`${CONFIG.MOBILE_URL}/api/mobile/notification`,
      message, { headers: { 'Authorization': `FINEMA ${AUTHORIZATION.MOBILE_TOKEN}` } })
  }
}
