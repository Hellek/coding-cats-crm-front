import Vue from 'vue'
import Router from 'vue-router'
import KitRouter from 'KitPlugins/router.js'
import routes from './routes'

Vue.use(Router)

const router = KitRouter.create(Router, routes)

export default router

KitRouter.ifEmptyPathRedirectToHomePage()