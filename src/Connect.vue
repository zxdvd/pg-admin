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
export default {
  data () {
    return {
      host: '',
      username: '',
      password: '',
      database: '',
      port: '',
    }
  },
  vuex: {
    getters: {
      currentCon: state => state.currentCon
    },
    actions: {
      changeCon: ({ dispatch }, con) => dispatch('CHANGE_CON', con),
      setSchemas: ({ dispatch }, uri, data) => dispatch('SET_SCHEMAS', uri, data),
    }
  },
  methods: {
    connect() {
      var uri = `postgres://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`
      uri = 'postgres://test:123456@localhost:5432/pigai_gk'
      fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: uri }),
      })
        .then(res => {
          if (res.ok) {
            this.changeCon(uri)
            return res.json()
          }
        })
        .then(json => {
          this.setSchemas(uri, json)
          this.$router.go('/db')
        })
        .catch(e => console.log('failed to connect', e))
    }
  }
}
</script>

<style lang="sass">
body {
  font-family: Helvetica, sans-serif;
}
</style>
