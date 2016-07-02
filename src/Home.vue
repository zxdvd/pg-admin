<template>
  <div class="columns">
    <aside class="column is-2 menu">
      <p class="menu-label">
        Schemas
      </p>
      <span class="select">
        <select v-model="selectedSchema">
          <option v-for="item in schemas" v-bind:value="$key">{{ $key }}</option>
        </select>
      </span>
      <p class="menu-label">
        Tables
      </p>
      <ul class="menu-list">
        <li v-for="t in schemas[selectedSchema]">
          <a :class="{'is-active': t === currentTable}" href="#" @click="setState('currentTable', t)">{{ t }}</a>
        </li>
      </ul>
    </aside>

    <div class="column autoflow">
      <div class="tabs">
        <ul>
          <li :class="{'is-active': item === tab}" v-for="item in tabs">
            <a @click="tab = item">{{ item }}</a>
          </li>
        </ul>
      </div>
      <div v-show="tab === 'Content'">
        <Show-Table></Show-Table>
      </div>
      <div v-show="tab === 'Structure'">
        <Structure></Structure>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ShowTable from './ShowTable.vue'
import Structure from './Structure.vue'
import { getColumns, getPrimaryKey } from './vuex/getters'
import { query, getTableIndex, getTableColumn } from './utils'

export default {
  data () {
    return {
      selectedSchema: 'public',
      tabs: ['Structure', 'Content', 'Query'],
      tab: 'Content',
      rows: [],
      dblclickedHeader: '',
    }
  },
  components: {
    ShowTable,
    Structure,
  },
  vuex: {
    getters: {
      currentCon: state => state.currentCon,
      schemas: state => state.currentSchemas,
      tables: state => state.tables,
      currentTable: state => state.currentTable,
    },
    actions: {
      setState: ({ dispatch }, key, value) => dispatch('SET_STATE', key, value),
      setSchemas: ({ dispatch }, uri, data) => dispatch('SET_SCHEMAS', uri, data),
    }
  },
}
</script>

<style lang="sass">
body {
  font-family: Helvetica, sans-serif;
}
.autoflow {
  overflow: auto;
}
</style>
