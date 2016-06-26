
const localStorageMiddleware = {
  onMutation (mutation, { currentCon }) {
    localStorage.setItem('currentCon', JSON.stringify(currentCon))
  }
}

export default localStorageMiddleware
