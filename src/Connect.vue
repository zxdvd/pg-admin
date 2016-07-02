<template>
  <div class="container">
    <h1>postgres admin</h1>
    <div class="control is-horizontal">
      <div class="control-label">
       <label class="label">Host</label>
      </div>
      <div class="control">
       <input class="input" type="text" v-model="host">
      </div>
    </div>
    <div class="control is-horizontal">
      <div class="control-label">
       <label class="label">Username</label>
      </div>
      <div class="control">
       <input class="input" type="text" v-model="username">
      </div>
    </div>
    <div class="control is-horizontal">
      <div class="control-label">
       <label class="label">Password</label>
      </div>
      <div class="control">
       <input class="input" type="text" v-model="password">
      </div>
    </div>
    <div class="control is-horizontal">
      <div class="control-label">
       <label class="label">Database</label>
      </div>
      <div class="control">
       <input class="input" type="text" v-model="database">
      </div>
    </div>
    <div class="control is-horizontal">
      <div class="control-label">
       <label class="label">Port</label>
      </div>
      <div class="control">
       <input class="input" type="text" v-model="port">
      </div>
    </div>
    <div class="control is-horizontal">
      <button class="button is-success" @click="connect">Connect</button>
    </div>
  </div>
</template>

<script>
import { query } from './utils'

export default {
  data () {
    return {
      host: 'localhost',
      username: '',
      password: '',
      database: '',
      port: '5432',
    }
  },
  vuex: {
    getters: {
      currentCon: state => state.currentCon
    },
    actions: {
      setState: ({ dispatch }, key, value) => dispatch('SET_STATE', key, value),
      setSchemas: ({ dispatch }, uri, data) => dispatch('SET_SCHEMAS', uri, data),
    }
  },
  methods: {
    async connect() {
      console.log('begin connect')
      var uri = `postgres://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`
      uri = 'postgres://psql:123456@zxd:5432/pigai_gk'
      const sql = `SELECT table_schema,string_agg(table_name, ',') as tables FROM information_schema.tables GROUP BY table_schema;`
      const data = await query(uri, sql)
      if (data) {
        this.setState('currentCon', uri)
        this.setSchemas(uri, data)
        this.$router.go('/db')
      }
      console.log('failed to connect to host!')
    }
  }
}
</script>

<style lang="sass">
body {
  font-family: Helvetica, sans-serif;
}
</style>
