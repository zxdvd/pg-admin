<template>
  <div class="autoflow">
    <table class="table is-narrow">
      <thead>
        <tr>
          <th v-for="item in columns" @keyup.enter="renameColumn(item, $event)">
            <span>{{ item }}</span>
            <div class="dropdown-content">
              <div @click='orderBy=`"${item}" DESC`'>Order DESC</div>
              <div @click='orderBy=`"${item}" ASC`'>Order ASC</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-show="rows.length === 0">
          <td>No data for this query!</td>
        </tr>
        <tr v-for="(index1, row) in rows">
          <td @dblclick="updating=[index1, col]" v-for="(index2, col) in columns">
            <input type="text"
              value="{{row[col]}}"
              v-focus="updating.toString() === [index1, col].toString()"
              v-show="updating.toString() === [index1, col].toString()"
              @blur="updating = []"
              @keyup.esc="updating = []"
              @keyup.enter="updateCol($event)">
            <span v-else>{{ row[col] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <a class="button" v-show="currentPage > 1" @click="currentPage=1">First</a>
    <a class="button" v-show="currentPage > 1" @click="currentPage-=1">Previous</a>
    <a class="button" @click="currentPage+=1">Next</a>
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
      updating: [],
      currentPage: 1,
      pageSize: 20,
      orderBy: '',
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
    'currentPage': function(val) {
      this.refreshTable()
    },
    'orderBy': function(val, oldval) {
      if (val !== oldval) {
        this.currentPage = 1
        this.refreshTable()
      }
    },
  },
  methods: {
    async refreshTable () {
      const { currentCon, currentTable, orderBy, pageSize, currentPage: page } = this
      let sql = `select * from ${currentTable}`
      if (orderBy)
        sql += ` ORDER BY ${orderBy}`
      const data = await query(currentCon, sql, {page, pageSize})
      Vue.set(this, 'rows', data)
    },
    async getTableInfo(t) {
      const indexes = await getTableIndex(this.currentCon, t)
      this.setState('tableInfo.indexes', indexes)
      const columns = await getTableColumn(this.currentCon, t)
      this.setState('tableInfo.columns', columns)
      await this.refreshTable()
    },
    async updateCol(event) {
      if (!this.primaryKey || this.updating.length !== 2)
        return
      const newVal = event.target.value
      const row = this.rows[this.updating[0]]
      const columnName = this.updating[1]
      var where = 'where '
      //deal with combined primary key
      if (this.primaryKey instanceof Array) {
        const tmp = this.primaryKey.map(el => `"${el}" = ${row[el]}`).join(' and ')
        where += tmp
      } else {
        where += `"${this.primaryKey}" = ${row[this.primaryKey]}`
      }
      const sql = `update "${this.currentTable}" set "${columnName}" = '${newVal}' ${where}`
      console.log('sql', sql)
      await query(this.currentCon, sql, {noPagination: true})
      this.refreshTable()
    },
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
