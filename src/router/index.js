import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import UserList from '@/components/users/UserList'
import ProjectList from '@/components/projects/ProjectList'
import AppList from '@/components/applications/AppList'
import Compile from '@/components/cicd/Compile'
import Deploy from '@/components/cicd/Deploy'
import Rollback from '@/components/cicd/Rollback'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users/list', component: UserList },
        { path: '/projects/list', component: ProjectList },
        { path: '/apps/list', component: AppList },
        { path: '/cicd/compile', component: Compile },
        { path: '/cicd/deploy', component: Deploy },
        { path: '/cicd/rollback', component: Rollback }
      ]

    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})
