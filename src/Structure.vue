<template>
  <div class="autoflow">
    <table class="table is-narrow">
      <thead>
        <tr>
          <th>Column</th>
          <th>Type</th>
          <th>IsArray</th>
          <th>AllowNull</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="col in columns">
          <td @dblclick="renaming=col.attname">
            <input type="text"
              value="{{col.attname}}"
              v-focus="renaming === col.attname"
              v-show="renaming === col.attname"
              @blur="renaming = ''"
              @keyup.esc="renaming = ''"
              @keyup.enter="renamingCol($event)">
            <span v-else>{{ col.attname }}</span>
          </td>
          <td>{{ col.column_type }}</td>
          <td>{{ col.attndims ? 'true': '' }}</td>
          <td>{{ !col.attnotnull }}</td>
          <td>{{ col.default_value | showNull }}</td>
        </tr>
        <tr v-show="addColumn">
          <td><input class="input" placeholder="column name" v-model="newColumn.name"></td>
          <td class="control has-addons">
            <span class="select">
              <select v-model="newColumn.type" @change="newColumn.len=''">
                <option v-for="option in dataType">
                  {{ option }}
                </option>
              </select>
            </span>
            <input class="input" placeholder="length of {{newColumn.type}}"
            v-if="dataTypeHasLength.includes(newColumn.type)"
            v-model="newColumn.len">
          </td>
          <td><input type="checkbox" v-model="newColumn.isArray"></td>
          <td><input type="checkbox" v-model="newColumn.allowNull"></td>
          <td class="control is-grouped">
            <input class="input" placeholder="default value" v-model="newColumn.defaultValue">
            <a class="button" @click="addNewColumn">Add it!</a>
          </td>
        </tr>
      </tbody>
    </table>
    <a class="button is-white is-link" @click="addColumn = !addColumn">{{ addColumn ? 'Cancel': 'Add Column' }}</a>
  </div>
</template>

<script>
import Vue from 'vue'
import { getColumns, getPrimaryKey } from './vuex/getters'
import { query, getTableIndex, getTableColumn } from './utils'
import { psql } from './dbmeta'

export default {
  data () {
    return {
      renaming: '',
      addColumn: false,
      dataType: psql.dataType,
      dataTypeHasLength: psql.dataTypeHasLength,
      newColumn: {},
    }
  },
  vuex: {
    getters: {
      currentCon: state => state.currentCon,
      currentTable: state => state.currentTable,
      columns: state => state.tableInfo.columns || [],
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
    },
    async renamingCol(event) {
      const new_name = event.target.value
      const sql = `ALTER TABLE "${this.currentTable}" RENAME "${this.renaming}" TO "${new_name}"`
      await query(this.currentCon, sql, {noPagination: true})
      this.renaming = ''
      this.getTableInfo(this.currentTable)
    },
    async addNewColumn() {
      console.log('add new column', this.newColumn)
      const { name, type, len, isArray, allowNull, defaultValue } = this.newColumn
      var sql = `ALTER TABLE "${this.currentTable}" ADD COLUMN "${name}" ${type}`
      if (len)
        sql += `(${len}) `
      if (isArray)
        sql += ' [] '
      if (!allowNull)
        sql += ' NOT NULL'
      if (defaultValue)
        sql += ` DEFAULT '${defaultValue}'`
      await query(this.currentCon, sql, {noPagination: true})
      this.renaming = ''
      this.getTableInfo(this.currentTable)
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
</style>
