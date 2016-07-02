
const localStorageMiddleware = {
  onMutation (mutation, state) {
    sessionStorage.setItem('currentCon', state.currentCon)
    sessionStorage.setItem('currentSchemas', JSON.stringify(state.currentSchemas))
    sessionStorage.setItem('currentTable', state.currentTable)
    sessionStorage.setItem('tableInfo', JSON.stringify(state.tableInfo))
  }
}

export default localStorageMiddleware
