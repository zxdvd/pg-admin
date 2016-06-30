
const localStorageMiddleware = {
  onMutation (mutation, { currentCon, currentSchemas }) {
    localStorage.setItem('currentCon', currentCon)
    localStorage.setItem('currentSchemas', JSON.stringify(currentSchemas))
  }
}

export default localStorageMiddleware
