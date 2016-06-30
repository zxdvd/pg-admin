import Vue from 'vue'
import Vuex from 'vuex'
import middlewares from './middlewares'

Vue.use(Vuex)

const state = {
  currentCon: localStorage.getItem('currentCon') || '',
  connections: {},
  schemas: {},
  tables: {},
  currentSchemas: JSON.parse(localStorage.getItem('currentSchemas')) || {},
}

const mutations = {
  CHANGE_CON (state, con) {
    state.currentCon = con
  },
  SET_SCHEMAS (state, uri, data) {
    const schemas = {}
    for (var item of data) {
      schemas[item.table_schema] = item.tables.split(/,/)
    }
    Vue.set(state, 'currentSchemas', schemas)
  },
  GET_TABLE_ROW (state, table, data) {
    if (data && data.length) {
      const header = Object.keys(data[0])
      Vue.set(state.tables, table, { header, data})
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  middlewares: [middlewares],
})
