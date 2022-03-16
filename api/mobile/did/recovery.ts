import axios from 'axios'
import { CONFIG } from '../../consts'
import { CryptoHelper } from '../../utils/ecdsa-CryptoHelper'

const genRecoveryMessage = (obj: {
  signature: string, public_key: string, key_type: string, uuid: string
}) => {
  return {
    new_key: {
      signature: obj.signature,
      public_key: obj.public_key,
      key_type: obj.key_type
    },
    device: {
      name: 'Tester\'s iPhone',
      model: 'iPhone 12',
      os: 'iOS',
      os_version: 'iOS 12',
      uuid: obj.uuid
    }
  }

}

export class Recovery {

  static async DID (userId: string, newKey: any, keyType: string, uuid: string) {
    const new_key = newKey[0].public_key
    const new_key_hash = CryptoHelper.sha256(newKey[0].public_key)
    const new_key_signature = CryptoHelper.sign(newKey[0].private_key, new_key_hash)
    const message = genRecoveryMessage({
      signature: new_key_signature, public_key: new_key, key_type: keyType, uuid: uuid
    })
    console.log('request: Recovery DID ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.MOBILE_URL}/api/mobile/users/${userId}/recovery`,
      message)
  }

  static async DIDWithoutNewKey (userId: string, keyType: string, uuid: string) {
    const message = genRecoveryMessage({
      signature: '', public_key: '', key_type: keyType, uuid: uuid
    })
    console.log('request: Recovery DID ', JSON.stringify(message, null, 2))
    return await axios.post(`${CONFIG.MOBILE_URL}/api/mobile/users/${userId}/recovery`,
      message)
  }
}
