<template>
  <div class="autoflow">
    <table class="table is-narrow">
      <thead>
        <tr>
          <th v-for="item in columns" @keyup.enter="renameColumn(item, $event)">
            <span>{{ item }}</span>
            <div class="dropdown-content">
              <div>Order DESC</div>
              <div>Order ASC</div>
            </div>
          </th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows">
          <td :contenteditable="$index === row.editrow" v-for="col in columns" @dblclick="changeRowData(row, $index)" @keyup.enter="updateRow(row, col, $event)">{{ row[col] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import { getColumns, getPrimaryKey } from './vuex/getters'
import { query, getTableIndex, getTableColumn } from './utils'

export default {
  data () {
    return {
      rows: [],
    }
  },
  vuex: {
    getters: {
      currentCon: state => state.currentCon,
      currentTable: state => state.currentTable,
      columns: getColumns,
      primaryKey: getPrimaryKey,
    },
    actions: {
      setState: ({ dispatch }, key, value) => dispatch('SET_STATE', key, value),
    }
  },
  created() {
    this.getTableInfo(this.currentTable)
  },
  watch: {
    'currentTable': function(val) {
      this.getTableInfo(val)
    },
  },
  methods: {
    async getTableInfo(t) {
      const indexes = await getTableIndex(this.currentCon, t)
      this.setState('tableInfo.indexes', indexes)
      const columns = await getTableColumn(this.currentCon, t)
      this.setState('tableInfo.columns', columns)
      const rows = await query(this.currentCon, `select * from ${t}`)
      Vue.set(this, 'rows', rows)
    },
    changeRowData(row, index) {
      Vue.set(row, 'editrow', index)
    },
    updateRow(row, col, event) {
      if (!this.primaryKey)
        return
      const new_val = event.target.innerText
      var where = 'where '
      if (this.primaryKey instanceof Array) {
        const tmp = this.primaryKey.map(el => `"${el}" = ${row[el]}`).join(' and ')
        where += tmp
      } else {
        where += `"${this.primaryKey}" = ${row[this.primaryKey]}`
      }
      const sql = `update "${this.currentTable}" set "${col}" = '${new_val}' ${where}`
      query(this.currentCon, sql, {noPagination: true})
      console.log('el', row, col, event, event.target.innerText)
    },
  }
}
</script>

<style lang="sass">
body {
  font-family: Helvetica, sans-serif;
}
.autoflow {
  overflow: auto;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  overflow: auto;
}
th:hover .dropdown-content {
  display: block;
}
</style>
