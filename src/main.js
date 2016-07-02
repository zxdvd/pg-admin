import Vue from 'vue'
import Router from 'vue-router'

import '../node_modules/bulma/bulma.sass'

import App from './App.vue'
import Connect from './Connect.vue'
import Home from './Home.vue'


Vue.use(Router)

Vue.filter('showNull', function(val) {
  return val === null ? 'null': val
})

var router = new Router({
  hashbang: false,
  linkActiveClass: 'active',
  history: true,
})

router.map({
  '*': {
    component: {
      template: '<div><h1>Page not found!</h1></div>',
    }
  },
  '/': {
    component: {
      template: '<div>I am here</div>',
    }
  },
  '/connect': {
    component: Connect,
  },
  '/db': {
    component: Home,
  }
})

router.start(App, '#app')
