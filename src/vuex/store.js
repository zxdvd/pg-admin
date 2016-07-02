import Vue from 'vue'
import Vuex from 'vuex'
import middlewares from './middlewares'

Vue.use(Vuex)

const state = {
  currentCon: sessionStorage.getItem('currentCon') || '',
  connections: {},
  currentSchemas: JSON.parse(sessionStorage.getItem('currentSchemas')) || {},
  currentTable: sessionStorage.getItem('currentTable') || '',
  currentTableSchema: {},
  tableInfo: JSON.parse(sessionStorage.getItem('tableInfo')) || {},
}

const mutations = {
  SET_STATE (state, key, value) {
    const dotIndex = key.lastIndexOf('.')
    //deal with nested key
    if (dotIndex > -1) {
      const attr1 = key.slice(0, dotIndex)
      const attr2 = key.slice(dotIndex + 1)
      Vue.set(state[attr1], attr2, value)
    } else {
      Vue.set(state, key, value)
    }
  },
  SET_SCHEMAS (state, uri, data) {
    const schemas = {}
    for (var item of data) {
      schemas[item.table_schema] = item.tables.split(/,/)
    }
    Vue.set(state, 'currentSchemas', schemas)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  middlewares: [middlewares],
})
