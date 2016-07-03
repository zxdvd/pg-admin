<template>
  <div>
    <textarea rows=3 class="textarea" placeholder="Your sql query string here." v-model="queryString"></textarea>
    <a class="button" @click="runQuery">Run</a>
    <div class="autoflow">
      <table class="table is-narrow">
        <thead>
          <tr>
            <th v-for="col in header">
              <span>{{ col }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in queryResult">
            <td v-for="item in row">{{ item }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { query } from './utils'

export default {
  data () {
    return {
      queryString: '',
      queryResult: null,
    }
  },
  computed: {
    header: function () {
      if (this.queryResult instanceof Array && this.queryResult.length) {
        return Object.keys(this.queryResult[0])
      }
    },
  },
  vuex: {
    getters: {
      currentCon: state => state.currentCon,
    },
    actions: {
      setState: ({ dispatch }, key, value) => dispatch('SET_STATE', key, value),
    }
  },
  methods: {
    async runQuery() {
      const data = await query(this.currentCon, this.queryString, {noPagination: true})
      console.log('data', data)
      Vue.set(this, 'queryResult', data)
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
