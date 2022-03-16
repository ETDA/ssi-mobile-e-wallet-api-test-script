import { KEY_TYPE } from '../../consts'
import { ID_INFO } from '../ekyc/ekyc'
import { Mobile } from '../register/mobile'
import { OTP } from './otp'
import { v4 as uuidv4 } from 'uuid'
import { DID } from '../did-register'

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
  email: ''
})

describe('Resend OTP', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Resend OTP', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      state.didKey2 = didRegister.didKey2
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

      const getOTP = await OTP.Get(state.userId)
      console.log('GET OTP: ', JSON.stringify(getOTP.data, null, 2))
      expect(getOTP.status).toEqual(200)

      const resendOTP = await OTP.Resend(state.userId)
      console.log('Resend OTP: ', JSON.stringify(resendOTP.data, null, 2))
      expect(resendOTP.status).toEqual(200)
      expect(resendOTP.data.result).toBe('success')
    } catch (err) {
      console.log(err.response.data)
      expect(err).not.toBeTruthy()
    }
  })

  test('Resend OTP email - Send request with incorrect ID in URL', async () => {
    try {
      const dummyUserId = uuidv4()
      const resendOTP = await OTP.Resend(dummyUserId)
      console.log('Resend OTP: ', JSON.stringify(resendOTP.data, null, 2))
      expect(resendOTP.status).toEqual(404)
      expect(resendOTP.data.result).toBe('success')
    } catch (err) {
      console.log(err.response.data)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})
