import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddBookView from '../views/AddBookView.vue'
import EditBookView from '../views/EditBookView.vue'
import ViewBookView from '../views/ViewBookView.vue'
import StatsView from '../views/StatsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsView
  },
  {
    path: '/add',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/book/:id',
    name: 'ViewBook',
    component: ViewBookView
  },
  {
    path: '/edit/:id',
    name: 'EditBook',
    component: EditBookView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
