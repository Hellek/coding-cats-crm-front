import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import navs from './modules/navs'
import roles from './modules/roles'
import users from './modules/users'
import tinkoffInvest from './modules/tinkoffInvest'

Vue.use(Vuex)

const isDevelopment = process.env.VUE_APP_MODE === 'development'

const store = new Vuex.Store({
	// https://vuex.vuejs.org/ru/guide/strict.html
	strict: isDevelopment,
	modules: {
		auth,
		navs,
		roles,
		users,
		tinkoffInvest,
	},
})

export default store