import { http } from 'KitPlugins/http'

function defaultState() {
	return {
		isAuthorized: JSON.parse(localStorage.getItem('auth/isAuthorized')) || false,
		isAuthorizing: true,
	}
}

export default {
	namespaced: true,
	state: defaultState(),
	mutations: {
		setIsAuthorized(state, status = false) {
			state.isAuthorized = status
			localStorage.setItem('auth/isAuthorized', status)
		},
		setIsAuthorizing(state, status) {
			state.isAuthorizing = status
		},
		dropState(state) {
			Object.assign(state, defaultState())
		},
	},
	actions: {
		dropToDefaults({ commit, dispatch }) {
			commit('dropState')
			dispatch('clearCache')
		},
		clearCache() {
			Object.keys(defaultState()).forEach(key => {
				localStorage.removeItem(`auth/${key}`)
			})
		},
		async authorize({ commit }, credentials) {
			try {
				commit('setIsAuthorizing', true)
				const { data } = await http.post('auth/login', credentials)
				commit('users/setUser', data, { root: true })
				commit('setIsAuthorized', true)
			} catch (error) {
				throw error
			} finally {
				commit('setIsAuthorizing', false)
			}
		},
		async unauthorize({ commit, dispatch, rootState }) {
			try {
				await http.post('auth/logout')
				commit('setIsAuthorized', false)

				Object.keys(rootState).forEach(moduleName => {
					dispatch(`${moduleName}/dropToDefaults`, null, { root: true })
				})
			} catch (error) {
				throw error
			}
		},
		setHttpHooks({ dispatch }) {
			http.interceptors.response.use(response => response, async error => {
				if (error.response.status === 401) {
					dispatch('auth/unauthorize', null, { root: true })
					error.disableUserNotice = true
					return Promise.reject(error)
				}

				return Promise.reject(error)
			})
		},
		async ping({ state, commit }) {
			if (!state.isAuthorized) return

			try {
				commit('setIsAuthorizing', true)
				const { data } = await http.get('auth/ping')
				commit('users/setUser', data, { root: true })
			} catch (error) {
				if (error.response.status === 401) return
			} finally {
				commit('setIsAuthorizing', false)
			}
		},
	},
}