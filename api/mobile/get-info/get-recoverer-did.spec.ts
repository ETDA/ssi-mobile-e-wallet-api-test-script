import { Mobile } from '../register/mobile'

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

describe('GET DID', () => {

  const state = getInitState()
  jest.setTimeout(20000)

  beforeEach(() => {
    state.didKey1 = []
  })

  test('GET DID', async () => {
    try {
      const getDid = await Mobile.GetRecovererDid()
      console.log('GET DID', JSON.stringify(getDid.data, null, 2))
      expect(getDid.status).toBe(200)
      expect(getDid.data.did_address).not.toBe(null)
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})
