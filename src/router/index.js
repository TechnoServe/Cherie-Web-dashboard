import { createRouter, createWebHistory } from 'vue-router'
import { auth } from "../js/firebase"
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta:{
        layout: 'LoginLayout'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta:{
        layout: 'DashboardLayout',
        auth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta:{
        layout: 'DashboardLayout',
        auth: true
      }
    },
    {
      path: '/ripeness/:ripeness',
      name: 'ripeness_stats',
      component: () => import('../views/RipenessStats.vue'),
      meta:{
        layout: 'DashboardLayout',
        auth: true
      }
    },
    {
      path: '/artifacts',
      name: 'artifacts',
      component: () => import('../views/Artifacts.vue'),
      meta:{
        layout: 'DashboardLayout',
        auth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.auth)) {
    auth.onAuthStateChanged(user => {
      if (user) {
        next()
      } else {
        next({
          name: "login",
        })
      }
    })
  } else if (to.matched.some(record => record.meta.guest)) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next({
          name: "profile",
        })
      } else {
        next()
      }
    })

  } else {
    next()
  }

})

export default router
