import { DID } from '../did-register'
import { KEY_TYPE } from '../../consts'
import { ID_INFO } from '../ekyc/ekyc'
import { v4 as uuidv4 } from 'uuid'
import { Mobile } from '../register/mobile'
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
    nonce: '',
    did2: '',
    nonce2: ''
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

describe('Get Mobile user', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Get Mobile user', async () => {
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
      expect(registerMobile.data.did_address).toBe(null)
      expect(registerMobile.data.user_id).not.toBe(null)

      const getMobileUser = await MobileInfo.GetMobileUser()
      console.log('Get Mobile User: ', JSON.stringify(getMobileUser.data,null, 2))
      expect(getMobileUser.status).toEqual(200)
      expect(getMobileUser.data.items[0].first_name).toBe(state.firstName)
      expect(getMobileUser.data.items[0].last_name).toBe(state.lastName)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})
