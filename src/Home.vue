<template>
  <div class="columns">
    <aside class="column is-2 menu">
      <p class="menu-label">
        Schemas
      </p>
      <select v-model="selectedSchema">
        <option v-for="item in schemas" v-bind:value="$key">{{ $key }}</option>
      </select>
      <p class="menu-label">
        Tables
      </p>
      <ul class="menu-list">
        <li v-for="t in schemas[selectedSchema]">
          <a href="#" @click="getTableInfo(t)">{{ t }}</a>
        </li>
      </ul>
    </aside>

    <div class="column">
      <div class="tabs">
        <ul>
          <li><a>Structure</a></li>
          <li><a>Content</a></li>
        </ul>
      </div>
      <table>
        <thead>
          <tr>
            <th v-for="item in header">{{ item }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows">
            <td v-for="item in row " @dblclick="changeRowData">{{ item }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { getTable } from './vuex/actions/api'

export default {
  data () {
    return {
      selectedSchema: 'public',
      selectedTable: null,
    }
  },
  created() {
    console.log('schema', this.schemas)
  },
  computed: {
    header: function () {
      if (this.selectedTable && this.tables[this.selectedTable])
        return this.tables[this.selectedTable].header || []
    },
    rows: function () {
      if (this.selectedTable && this.tables[this.selectedTable])
        return this.tables[this.selectedTable].data || []
    },
  },
  vuex: {
    getters: {
      currentCon: state => state.currentCon,
      schemas: state => state.currentSchemas,
      tables: state => state.tables,
    },
    actions: {
      changeCon: ({ dispatch }, con) => dispatch('CHANGE_CON', con),
      setSchemas: ({ dispatch }, uri, data) => dispatch('SET_SCHEMAS', uri, data),
      getTable: getTable,
    }
  },
  methods: {
    getTableInfo(t) {
      this.selectedTable = t
      this.getTable(t)
    },
    changeRowData() {

    },
  }
}
</script>

<style lang="sass">
body {
  font-family: Helvetica, sans-serif;
}
</style>
