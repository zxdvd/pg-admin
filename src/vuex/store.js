import Vue from 'vue'
import Vuex from 'vuex'
import middlewares from './middlewares'

Vue.use(Vuex)

const state = {
  currentCon: '',
  connections: {},
  schemas: {},
  currentSchemas: {},
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
  }
}

export default new Vuex.Store({
  state,
  mutations,
  middlewares: [middlewares],
})
