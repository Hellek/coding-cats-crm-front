import { http } from 'KitPlugins/http'

function defaultState() {
	return {
		activeStatusList: {
			0: {
				value: 0,
				label: 'нет',
			},
			1: {
				value: 1,
				label: 'да',
			},
		},
		isAuthorized: JSON.parse(localStorage.getItem('users/isAuthorized')) || false,
	}
}

export default {
	namespaced: true,
	state: defaultState(),
	mutations: {
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
				await http.post('auth/login', credentials)
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