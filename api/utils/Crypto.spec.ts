import { CryptoHelper } from './CryptoHelper'

describe('matching cities to foods', () => {
  let privateKey = ''

  test('genKey', async () => {
    const keys = CryptoHelper.genKey()
    privateKey = keys.private_key

    console.log(keys)
    expect(keys.private_key).toBeTruthy()
    expect(keys.public_key).toBeTruthy()
  })

  test('sign', async () => {
    const msg = { xxx: 3}
    const sig = CryptoHelper.sign(privateKey, msg)
    expect(sig).toBeTruthy()

  })

  test('encodeBase64', async () => {
    const base64 = CryptoHelper.encodeBase64('kuy')
    expect(base64).toBe('a3V5')
  })
})
