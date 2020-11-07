import { http } from 'KitPlugins/http'

function defaultState() {
	return {
		isAuthorized: JSON.parse(localStorage.getItem('users/isAuthorized')) || false,
		user: JSON.parse(localStorage.getItem('users/user')) || {},
	}
}

export default {
	namespaced: true,
	state: defaultState(),
	mutations: {
		setUser(state, user) {
			state.user = user
			localStorage.setItem('users/user', JSON.stringify(user))
		},
		setIsAuthorized(state, status = false) {
			state.isAuthorized = status
			localStorage.setItem('users/isAuthorized', status)
		},
		dropState(state) {
			Object.assign(state, defaultState())
		},
	},
	actions: {
		async authorize({ commit }, credentials) {
			try {
				const { data } = await http.post('auth/login', credentials)
				commit('setUser', data)
				commit('setIsAuthorized', true)
			} catch (error) {
				throw error
			}
		},
		async unauthorize({ commit }) {
			try {
				await http.post('auth/logout')
				commit('setIsAuthorized', false)
			} catch (error) {
				throw error
			}
		},
		/* setInitials({ dispatch }) {
			dispatch('setHttpHooks')
		}, */
		/* setHttpHooks({ dispatch }) {
			http.interceptors.response.use(response => response, async error => {
				if (error.response.status === 401) {
					dispatch('users/unauthorize', null, { root: true })
					// return Promise.resolve()
				}

				return Promise.reject(error)
			})
		}, */
	},
}