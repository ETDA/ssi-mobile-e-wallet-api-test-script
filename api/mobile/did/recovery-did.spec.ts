import { ERR_REQUIRE, INVALID, KEY_TYPE } from '../../consts'
import { v4 as uuidv4 } from 'uuid'
import { Mobile } from '../../mobile/register/mobile'
import { Recovery } from './recovery'
import { ID_INFO } from '../ekyc/ekyc'
import { UserDID } from './update-user-did'
import { DID } from '../did-register'
import { Recoverer } from '../recoverer'
import { DIDNonce } from '../nonce'
const thaiIdCard = require('thai-id-card')
const faker = require('faker')

let getInitState: any = () => ({
  didKey1: [],
  didKey2: [],
  didKey3: [],
  recovererKey1: [],
  data: {
    did: '',
    nonce: ''
  },
  recoverer: {
    did: ''
  }
})

describe('Recovery DID', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
    state.didKey2 = []
    state.didKey3 = []
    state.recovererKey1 = []
  })

  test('Recovery DID', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      expect(didRegister.request.status).toEqual(201)
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      state.didKey2 = didRegister.didKey2

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

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const nonce = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce : ', JSON.stringify(nonce.data, null, 2))
      expect(nonce.status).toEqual(200)
      state.data.nonce = nonce.data.nonce

      const addRecoverer = await Recoverer.Add(state.data.did, state.didKey1, state.recoverer.did, state.data.nonce)
      console.log('Add recoverer: ', JSON.stringify(addRecoverer.data, null, 2))
      expect(addRecoverer.status).toEqual(201)

      const uuid2 = uuidv4()
      const recoveryDid = await Recovery.DID(state.userId, state.didKey2,
        KEY_TYPE.EcdsaSecp256r1VerificationKey2019, uuid2)
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })

  test('Recovery DID - Send request with incorrect key_type', async () => {
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

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const nonce = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce : ', JSON.stringify(nonce.data, null, 2))
      expect(nonce.status).toEqual(200)
      state.data.nonce = nonce.data.nonce

      const addRecoverer = await Recoverer.Add(state.data.did, state.didKey1, state.recoverer.did, state.data.nonce)
      console.log('Add recoverer: ', JSON.stringify(addRecoverer.data, null, 2))
      expect(addRecoverer.status).toEqual(201)

      const uuid2 = uuidv4()
      const recoveryDid = await Recovery.DID(state.userId, state.didKey2,
        'key_type', uuid2)
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Recovery DID - Send request without new_key & signature', async () => {
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

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const nonce = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce : ', JSON.stringify(nonce.data, null, 2))
      expect(nonce.status).toEqual(200)
      state.data.nonce = nonce.data.nonce

      const addRecoverer = await Recoverer.Add(state.data.did, state.didKey1, state.recoverer.did, state.data.nonce)
      console.log('Add recoverer: ', JSON.stringify(addRecoverer.data, null, 2))
      expect(addRecoverer.status).toEqual(201)

      const uuid2 = uuidv4()
      const recoveryDid = await Recovery.DIDWithoutNewKey(state.userId,
        KEY_TYPE.EcdsaSecp256r1VerificationKey2019, uuid2)
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields['new_key.public_key'].code).toBe(ERR_REQUIRE.NEW_KEY.CODE)
      expect(err.response.data.fields['new_key.public_key'].message).toBe(ERR_REQUIRE.NEW_KEY.MESSAGE)
      expect(err.response.data.fields['new_key.signature'].code).toBe(ERR_REQUIRE.NEW_KEY_SIGNATURE.CODE)
      expect(err.response.data.fields['new_key.signature'].message).toBe(ERR_REQUIRE.NEW_KEY_SIGNATURE.MESSAGE)
    }
  })

  test('Recovery DID - Send request without key_type', async () => {
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

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const nonce = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce : ', JSON.stringify(nonce.data, null, 2))
      expect(nonce.status).toEqual(200)
      state.data.nonce = nonce.data.nonce

      const addRecoverer = await Recoverer.Add(state.data.did, state.didKey1, state.recoverer.did, state.data.nonce)
      console.log('Add recoverer: ', JSON.stringify(addRecoverer.data, null, 2))
      expect(addRecoverer.status).toEqual(201)

      const uuid2 = uuidv4()
      const recoveryDid = await Recovery.DID(state.userId, state.didKey2, '', uuid2)
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Recovery DID Send request without device\'s uuid', async () => {
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

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const nonce = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce : ', JSON.stringify(nonce.data, null, 2))
      expect(nonce.status).toEqual(200)
      state.data.nonce = nonce.data.nonce

      const addRecoverer = await Recoverer.Add(state.data.did, state.didKey1, state.recoverer.did, state.data.nonce)
      console.log('Add recoverer: ', JSON.stringify(addRecoverer.data, null, 2))
      expect(addRecoverer.status).toEqual(201)

      const recoveryDid = await Recovery.DID(state.userId, state.didKey2,
        KEY_TYPE.EcdsaSecp256r1VerificationKey2019, '')
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
      expect(err.response.data.code).toBe(INVALID.PARAMS.CODE)
      expect(err.response.data.message).toBe(INVALID.PARAMS.MESSAGE)
      expect(err.response.data.fields['device.uuid'].code).toBe(ERR_REQUIRE.DEVICE_UUID.CODE)
      expect(err.response.data.fields['device.uuid'].message).toBe(ERR_REQUIRE.DEVICE_UUID.MESSAGE)
    }
  })

  test('Recovery DID - Send request with incorrect id in URL', async () => {
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

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const nonce = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce : ', JSON.stringify(nonce.data, null, 2))
      expect(nonce.status).toEqual(200)
      state.data.nonce = nonce.data.nonce

      const addRecoverer = await Recoverer.Add(state.data.did, state.didKey1, state.recoverer.did, state.data.nonce)
      console.log('Add recoverer: ', JSON.stringify(addRecoverer.data, null, 2))
      expect(addRecoverer.status).toEqual(201)

      const uuid2 = uuidv4()
      const dummyUserId = uuidv4()
      const recoveryDid = await Recovery.DID(dummyUserId, state.didKey2,
        KEY_TYPE.EcdsaSecp256r1VerificationKey2019, uuid2)
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(404)
    } catch (err) {
      console.log(err.response)
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(404)
    }
  })

  test('Recovery DID - Send request without add recoverer', async () => {
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

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const uuid2 = uuidv4()
      const recoveryDid = await Recovery.DID(state.userId, state.didKey2,
        KEY_TYPE.EcdsaSecp256r1VerificationKey2019, uuid2)
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Recovery DID - Send request with the duplicated uuid', async () => {
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

      const updateDid = await UserDID.Update(state.data.did, state.userId, state.didKey1, state.userId)
      console.log('Update DID: ', JSON.stringify(updateDid.data, null, 2))
      expect(updateDid.status).toEqual(200)

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const nonce = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce : ', JSON.stringify(nonce.data, null, 2))
      expect(nonce.status).toEqual(200)
      state.data.nonce = nonce.data.nonce

      const addRecoverer = await Recoverer.Add(state.data.did, state.didKey1, state.recoverer.did, state.data.nonce)
      console.log('Add recoverer: ', JSON.stringify(addRecoverer.data, null, 2))
      expect(addRecoverer.status).toEqual(201)

      const recoveryDid = await Recovery.DID(state.userId, state.didKey2,
        KEY_TYPE.EcdsaSecp256r1VerificationKey2019, state.uuid)
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })

  test('Recovery DID - Send request without update user DID', async () => {
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

      const getRecovererDid = await Mobile.GetRecovererDid()
      console.log('GET Recoverer DID: ', JSON.stringify(getRecovererDid.data, null, 2))
      state.recoverer.did = getRecovererDid.data.did_address

      const nonce = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce : ', JSON.stringify(nonce.data, null, 2))
      expect(nonce.status).toEqual(200)
      state.data.nonce = nonce.data.nonce

      const addRecoverer = await Recoverer.Add(state.data.did, state.didKey1, state.recoverer.did, state.data.nonce)
      console.log('Add recoverer: ', JSON.stringify(addRecoverer.data, null, 2))
      expect(addRecoverer.status).toEqual(201)

      const uuid2 = uuidv4()
      const recoveryDid = await Recovery.DID(state.userId, state.didKey2,
        KEY_TYPE.EcdsaSecp256r1VerificationKey2019, uuid2)
      console.log('Recovery DID: ', JSON.stringify(recoveryDid.data, null, 2))
      expect(recoveryDid.status).toEqual(400)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).toBeTruthy()
      expect(err.response.status).toEqual(400)
    }
  })
})
