export const getInitialState = () => ({
  currentStep: 'auth',
  currentUser: null,
  emailVerified: false,
  mobileVerified: false,
  kycSubStep: 1,
  kycSubStepStatus: { 1: false, 2: false, 3: false, 4: false },
  userData: {
    name: '', email: '', mobile: '', password: '',
    kyc: {}, riskAnswers: {}, riskScore: 0, riskProfile: '', selectedPlan: {},
    docsStatus: { pan: false, 'aadhaar-front': false, 'aadhaar-back': false, profile: false },
  },
})
