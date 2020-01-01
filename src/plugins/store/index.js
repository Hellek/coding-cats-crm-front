import Vue from 'vue'
import Vuex from 'vuex'
import roles from './modules/roles'
import users from './modules/users'

Vue.use(Vuex)

const isDevelopment = process.env.VUE_APP_MODE === 'development'

const store = new Vuex.Store({
	// https://vuex.vuejs.org/ru/guide/strict.html
	strict: isDevelopment,
	modules: {
		roles,
		users,
	},
})

export default store