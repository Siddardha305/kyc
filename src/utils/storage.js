const LS_KEY_PREFIX = 'kyc_user_'
const SS_CURRENT = 'kyc_current_user'

export const saveUserProgress = (identifier, userState) => {
  if (!identifier) return
  const copy = { ...userState }
  delete copy.currentUser
  localStorage.setItem(`${LS_KEY_PREFIX}${identifier}`, JSON.stringify(copy))
}
export const loadUserProgress = (identifier) =>
  JSON.parse(localStorage.getItem(`${LS_KEY_PREFIX}${identifier}`) || 'null')
export const userExists = (identifier) =>
  localStorage.getItem(`${LS_KEY_PREFIX}${identifier}`) !== null
export const saveCurrentSession = (identifier) => sessionStorage.setItem(SS_CURRENT, identifier)
export const loadCurrentSession = () => sessionStorage.getItem(SS_CURRENT)
export const clearCurrentSession = () => sessionStorage.removeItem(SS_CURRENT)
