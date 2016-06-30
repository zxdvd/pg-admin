<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import store from './vuex/store'

window.store = store
export default {
  store,
}
</script>
