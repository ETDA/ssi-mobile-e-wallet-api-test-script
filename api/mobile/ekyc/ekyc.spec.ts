
let getInitState: any = () => ({
  idCardNo: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  laserId: ''
})

describe('e-KYC', () => {
  // const state = getInitState()
  // jest.setTimeout(20000)

  // test('e-KYC', async () => {
  //   try {
  //     state.idCardNo = ID_INFO.ID_CARD_NO.CORRECT
  //     state.firstName = ID_INFO.FIRST_NAME.CORRECT
  //     state.lastName = ID_INFO.LAST_NAME.CORRECT
  //     state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
  //     state.laserId = ID_INFO.LASER_ID.CORRECT
  //
  //     const ekyc = await Ekyc.idInfo(state.idCardNo, state.firstName, state.lastName, state.dateOfBirth, state.laserId)
  //     console.log('e-KYC: ', JSON.stringify(ekyc.data, null, 2))
  //   } catch (err) {
  //     console.log(err.response)
  //     expect(err).not.toBeTruthy()
  //   }
  // })
  //
  // test('e-KYC - Send request with incorrect id_card_no', async () => {
  //   try {
  //     state.idCardNo = ID_INFO.ID_CARD_NO.INCORRECT
  //     state.firstName = ID_INFO.FIRST_NAME.CORRECT
  //     state.lastName = ID_INFO.LAST_NAME.CORRECT
  //     state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
  //     state.laserId = ID_INFO.LASER_ID.CORRECT
  //
  //     const ekyc = await Ekyc.idInfo(state.idCardNo, state.firstName, state.lastName, state.dateOfBirth, state.laserId)
  //     console.log('e-KYC: ', JSON.stringify(ekyc.data, null, 2))
  //   } catch (err) {
  //     console.log(err.response)
  //     expect(err).not.toBeTruthy()
  //   }
  // })
  //
  // test('e-KYC - Send request with incorrect first_name', async () => {
  //   try {
  //     state.idCardNo = ID_INFO.ID_CARD_NO.CORRECT
  //     state.firstName = ID_INFO.FIRST_NAME.INCORRECT
  //     state.lastName = ID_INFO.LAST_NAME.CORRECT
  //     state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
  //     state.laserId = ID_INFO.LASER_ID.CORRECT
  //
  //     const ekyc = await Ekyc.idInfo(state.idCardNo, state.firstName, state.lastName, state.dateOfBirth, state.laserId)
  //     console.log('e-KYC: ', JSON.stringify(ekyc.data, null, 2))
  //   } catch (err) {
  //     console.log(err.response)
  //     expect(err).not.toBeTruthy()
  //   }
  // })
  //
  // test('e-KYC - Send request with incorrect last_name', async () => {
  //   try {
  //     state.idCardNo = ID_INFO.ID_CARD_NO.CORRECT
  //     state.firstName = ID_INFO.FIRST_NAME.CORRECT
  //     state.lastName = ID_INFO.LAST_NAME.INCORRECT
  //     state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
  //     state.laserId = ID_INFO.LASER_ID.CORRECT
  //
  //     const ekyc = await Ekyc.idInfo(state.idCardNo, state.firstName, state.lastName, state.dateOfBirth, state.laserId)
  //     console.log('e-KYC: ', JSON.stringify(ekyc.data, null, 2))
  //   } catch (err) {
  //     console.log(err.response)
  //     expect(err).not.toBeTruthy()
  //   }
  // })
  //
  // test('e-KYC - Send request with incorrect date_of_birth', async () => {
  //   try {
  //     state.idCardNo = ID_INFO.ID_CARD_NO.CORRECT
  //     state.firstName = ID_INFO.FIRST_NAME.CORRECT
  //     state.lastName = ID_INFO.LAST_NAME.CORRECT
  //     state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.INCORRECT
  //     state.laserId = ID_INFO.LASER_ID.CORRECT
  //
  //     const ekyc = await Ekyc.idInfo(state.idCardNo, state.firstName, state.lastName, state.dateOfBirth, state.laserId)
  //     console.log('e-KYC: ', JSON.stringify(ekyc.data, null, 2))
  //   } catch (err) {
  //     console.log(err.response)
  //     expect(err).not.toBeTruthy()
  //   }
  // })
  //
  // test('e-KYC - Send request with incorrect laser_id', async () => {
  //   try {
  //     state.idCardNo = ID_INFO.ID_CARD_NO.CORRECT
  //     state.firstName = ID_INFO.FIRST_NAME.CORRECT
  //     state.lastName = ID_INFO.LAST_NAME.CORRECT
  //     state.dateOfBirth = ID_INFO.DATE_OF_BIRTH.CORRECT
  //     state.laserId = ID_INFO.LASER_ID.INCORRECT
  //
  //     const ekyc = await Ekyc.idInfo(state.idCardNo, state.firstName, state.lastName, state.dateOfBirth, state.laserId)
  //     console.log('e-KYC: ', JSON.stringify(ekyc.data, null, 2))
  //   } catch (err) {
  //     console.log(err.response)
  //     expect(err).not.toBeTruthy()
  //   }
  // })
})
