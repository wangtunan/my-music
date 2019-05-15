import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/recommend' },
    { path: '/recommend', name: 'RecommendIndex', component: () => import('components/recommend/index') },
    { path: '/singer', name: 'SingerIndex', component: () => import('components/singer/index') },
    { path: '/rank', name: 'RankIndex', component: () => import('components/rank/index') },
    { path: '/search', name: 'SearchIndex', component: () => import('components/search/index') }
  ]
})
