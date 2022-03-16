import { ERR_REQUIRE, INVALID, KEY_TYPE } from '../../consts'
import { ID_INFO } from '../ekyc/ekyc'
import { Mobile } from '../register/mobile'
import { Token } from './token'
import { v4 as uuidv4 } from 'uuid'
import { DID } from '../did-register'

const thaiIdCard = require('thai-id-card')
const faker = require('faker')

const getInitState: any = () => ({
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
  uuid: ''
})

describe('Update token', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('Update token', async () => {
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

      let token = uuidv4()
      const tokenUpdate = await Token.Update(state.data.did, state.uuid, token, state.uuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })

  test('Update token - Send request with incorrect did_address', async () => {
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

      let token = uuidv4()
      const dummyDid = `did:idin:${uuidv4()}`
      const tokenUpdate = await Token.Update(dummyDid, state.uuid, token, state.uuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update token - Send request with incorrect uuid', async () => {
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

      let token = uuidv4()
      const dummyUuid = uuidv4()
      const tokenUpdate = await Token.Update(state.data.did, dummyUuid, token, state.uuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields.uuid.code).toBe(INVALID.UUID.CODE)
      expect(err.response.data.fields.uuid.message).toBe(INVALID.UUID.MESSAGE)
    }
  })

  test('Update token - Send request without did_address', async () => {
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

      let token = uuidv4()
      const tokenUpdate = await Token.Update('', state.uuid, token, state.uuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err.response.status).toEqual(400)
    }
  })

  test('Update token - Send request without uuid', async () => {
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

      let token = uuidv4()
      const tokenUpdate = await Token.Update(state.data.did, '', token, state.uuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields.uuid.code).toBe(ERR_REQUIRE.UUID.CODE)
      expect(err.response.data.fields.uuid.message).toBe(ERR_REQUIRE.UUID.MESSAGE)
    }
  })

  test('Update token - Send request without token', async () => {
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

      const tokenUpdate = await Token.Update(state.data.did, state.uuid, '', state.uuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields.token.code).toBe(ERR_REQUIRE.TOKEN.CODE)
      expect(err.response.data.fields.token.message).toBe(ERR_REQUIRE.TOKEN.MESSAGE)
    }
  })

  test('Update token - Send with incorrect uuid in URL', async () => {
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

      let token = uuidv4()
      const dummyUuid = uuidv4()
      const tokenUpdate = await Token.Update(state.data.did, state.uuid, token, dummyUuid)
      console.log('Update Token: ', JSON.stringify(tokenUpdate.data, null, 2))
      expect(tokenUpdate.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })
})
