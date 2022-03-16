import { DID } from '../did-register'
import { KEY_TYPE } from '../../consts'
import { ID_INFO } from '../ekyc/ekyc'
import { v4 as uuidv4 } from 'uuid'
import { Mobile } from '../register/mobile'
import { UserDID } from '../did/update-user-did'
import { MobileInfo } from './get'

const thaiIdCard = require('thai-id-card')
const faker = require('faker')

let getInitState: any = () => ({
  keyId: '',
  didKey1: [],
  didKey2: [],
  didKey3: [],
  didKey4: [],
  data: {
    did: '',
    nonce: ''
  },
  didId: '',
  idCardNo: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  laserId: '',
  userId: '',
  registerDate: '',
  email: '',
  uuid: ''
})

describe('Get DID', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get DID', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      expect(didRegister.request.status).toEqual(201)

      state.idCardNo = thaiIdCard.generate()
      state.firstName = faker.name.firstName()
      state.lastName = faker.name.lastName()
      state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
      state.laserId = ID_INFO.LASER_ID.CORRECT
      state.email = faker.internet.email()
      state.uuid = uuidv4()

      const registerMobile = await Mobile.Register(state.didKey1, state.idCardNo, state.firstName,
        state.lastName, state.dateOfBirth, state.laserId, state.email, state.uuid)
      console.log('Register Mobile: ', JSON.stringify(registerMobile.data, null, 2))
      expect(registerMobile.status).toEqual(201)
      state.userId = registerMobile.data.user_id

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      const getMobileinfo = await MobileInfo.GetMobileUserInfoByDID(state.data.did, state.didKey1, state.data.did)
      console.log('Get DID: ', JSON.stringify(getMobileinfo.data, null, 2))
      expect(getMobileinfo.status).toEqual(200)
      expect(getMobileinfo.data.did_address).toBe(state.data.did)
      expect(getMobileinfo.data.first_name).toBe(state.firstName)
      expect(getMobileinfo.data.last_name).toBe(state.lastName)
      expect(getMobileinfo.data.email).toBe(state.email)
      expect(getMobileinfo.data.device.uuid).toBe(state.uuid)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})
