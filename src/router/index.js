import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/recommend' },
    {
      path: '/recommend',
      name: 'RecommendIndex',
      component: () => import('components/recommend/index'),
      children: [
        { path: ':id', component: () => import('components/disc/disc.vue') }
      ]
    },
    {
      path: '/singer',
      name: 'SingerIndex',
      component: () => import('components/singer/index'),
      children: [
        { path: ':id', component: () => import('components/singer-detail/singer-detail.vue') }
      ]
    },
    {
      path: '/rank',
      name: 'RankIndex',
      component: () => import('components/rank/index'),
      children: [
        { path: ':id', component: () => import('components/top-list/top-list.vue') }
      ]
    },
    { path: '/search', name: 'SearchIndex', component: () => import('components/search/index') }
  ]
})
