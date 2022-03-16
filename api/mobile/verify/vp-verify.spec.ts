import { DID } from '../did-register'
import { KEY_TYPE, VC_STATUS } from '../../consts'
import { ID_INFO } from '../ekyc/ekyc'
import { v4 as uuidv4 } from 'uuid'
import { Mobile } from '../register/mobile'
import { UserDID } from '../did/update-user-did'
import { SchemaBody } from './material/schema-body'
import { Schema } from './material/schema'
import { DIDNonce } from '../nonce'
import { DIDDoc } from './material/doc'
import { VC } from './material/vc'
import { Gen } from './material/gen-vc-vp'
import { Verify } from './material/verify'
import { VCStatus } from './material/status'
import { EXAMPLE_VP } from './material/example-vc-vp'
import { PostVerify } from './material/mobile-verify'
import axios from 'axios'

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
  audience: {
    did: ''
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
describe('VP verify', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('VP verify', async () => {
    try {
      const didRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('DID Register: ', JSON.stringify(didRegister.request.data, null, 2))
      state.data.did = didRegister.request.data.id
      state.didKey1 = didRegister.didKey1
      expect(didRegister.request.status).toEqual(201)

      const audRegister = await DID.Register(KEY_TYPE.EcdsaSecp256r1VerificationKey2019)
      console.log('Audience Register: ', JSON.stringify(audRegister.request.data, null, 2))
      expect(audRegister.request.status).toEqual(201)
      state.audience.did = audRegister.request.data.id

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

      const nonce1 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 1: ', JSON.stringify(nonce1.data, null, 2))
      expect(nonce1.status).toEqual(200)
      state.data.nonce = nonce1.data.nonce

      const vcRegister = await VC.Register(state.data.did, state.didKey1, state.data.nonce)
      console.log('VC Register: ', JSON.stringify(vcRegister.data, null, 2))
      expect(vcRegister.status).toEqual(201)
      state.cid = vcRegister.data.cid

      const nonce2 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 2: ', JSON.stringify(nonce2.data, null, 2))
      expect(nonce2.status).toEqual(200)
      state.data.nonce = nonce2.data.nonce

      const schemaName = faker.name.title()
      const schemaType = faker.name.firstName() + `'sDocument` + '_Type'
      const schemabodyDesc = faker.name.jobTitle()
      const schemaBodyType = 'object'
      const schemaBodyProperties = {
        'example_string': {
          'type': 'string'
        }
      }
      const schemaRequired = ['example_string']
      const additional = true

      const schemaBody = SchemaBody.Message(schemaName, schemabodyDesc, schemaBodyType, schemaBodyProperties, schemaRequired, additional)
      console.log('SchemaBody: ', JSON.stringify(schemaBody, null, 2))

      const createSchema = await Schema.Create(schemaName, schemaType, schemaBody)
      console.log('Create Schema: ', JSON.stringify(createSchema.data, null, 2))
      // expect(createSchema.status).toEqual(201)
      state.schemaId = createSchema.data.id
      state.schemaName = createSchema.data.schema_name

      const didDocHistory1 = await DIDDoc.GetHistory(state.data.did)
      console.log('DID Doc History1 : ', JSON.stringify(didDocHistory1.data, null, 2))
      expect(didDocHistory1.status).toEqual(200)
      state.keyId = didDocHistory1.data.did_document[0].verificationMethod[0].id

      const nonce3 = await DIDNonce.getDIDNonce(state.data.did)
      console.log('Nonce 3: ', JSON.stringify(nonce3.data, null, 2))
      expect(nonce3.status).toEqual(200)
      state.data.nonce = nonce3.data.nonce

      const vcSubject = { 'example_string': 'Tony' }
      const jwtVc = await Gen.VC(state.cid, state.data.did, state.data.did, state.didKey1,
        state.keyId, state.schemaId, state.schemaName, schemaType, state.issuanceDate, vcSubject)

      const vcAddStatus = await VCStatus.Add(state.cid, state.data.did, VC_STATUS.ACTIVE,
        state.didKey1, state.data.nonce, jwtVc)
      console.log('Add VC Status: ', JSON.stringify(vcAddStatus.data, null, 2))
      expect(vcAddStatus.status).toEqual(200)

      const vcGetStatus = await VCStatus.Get(state.cid)
      console.log('Get VC Status: ', JSON.stringify(vcGetStatus.data, null, 2))
      expect(vcGetStatus.status).toEqual(200)
      state.issuanceDate = vcGetStatus.data.created_at

      const vcVerify = await Verify.VC(jwtVc)
      console.log('VC Verify: ', JSON.stringify(vcVerify.request.data, null, 2))
      expect(vcVerify.request.status).toEqual(200)

      const jwtVp = await Gen.VP(jwtVc, state.cid, state.data.did, state.audience.did, state.didKey1,
        state.keyId, state.schemaId, EXAMPLE_VP.TYPE, state.issuanceDate)
      console.log('vp_jwt: ', jwtVp)

      const postMobileVerify = await PostVerify.Mobile(jwtVp, state.data.did, state.didKey1)
      console.log('Post Mobile Verify: ', JSON.stringify(postMobileVerify.data, null, 2))
      expect(postMobileVerify.status).toEqual(201)
      const jwtEndpoint = postMobileVerify.data.endpoint

      const getJWTtoVerify = await axios.get(jwtEndpoint)
      console.log('Get jwt: ', JSON.stringify(getJWTtoVerify.data, null, 2))
      expect(getJWTtoVerify.status).toEqual(200)
      const jwtFromEndpoint = getJWTtoVerify.data.jwt

      const vpVerify = await Verify.VP(jwtFromEndpoint)
      console.log('VP Verify: ', JSON.stringify(vpVerify.data, null, 2))
      expect(vpVerify.status).toEqual(200)
    } catch (err) {
      console.log(err.response)
      console.log(JSON.stringify(err.response.data, null, 2))
      expect(err).not.toBeTruthy()
    }
  })
})
