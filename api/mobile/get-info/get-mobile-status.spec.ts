
import { MobileInfo } from './get'

describe('Get mobile status', () => {

  // const state = getInitState()
  // jest.setTimeout(20000)

  test('Get mobile status', async () => {
    try {
      const getMobileStatus = await MobileInfo.GetMobileStatus()
      console.log('GET Mobile Status: ',JSON.stringify(getMobileStatus.data, null, 2))
      expect(getMobileStatus.status).toEqual(200)
      expect(getMobileStatus.data.status).toBe('OK')
    } catch (err) {
      console.log(err.response)
      expect(err).not.toBeTruthy()
    }
  })
})
