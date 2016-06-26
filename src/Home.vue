<template>
  <div>
    <aside class="menu">
      <p class="menu-label">
        Schemas
      </p>
      <ul class="menu-list">
        <li v-for="item in schemas">
          <a href="#">{{ $key }}</a>
        </li>
      </ul>
    </aside>
    <h1>postgres admin</h1>
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
      currentCon: state => state.currentCon,
      schemas: state => state.currentSchemas,
    },
    actions: {
      changeCon: ({ dispatch }, con) => dispatch('CHANGE_CON', con),
      setSchemas: ({ dispatch }, uri, data) => dispatch('SET_SCHEMAS', uri, data),
    }
  },
  methods: {
  }
}
</script>

<style lang="sass">
body {
  font-family: Helvetica, sans-serif;
}
</style>
