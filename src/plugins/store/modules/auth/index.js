import { http } from 'KitPlugins/http'
import jwtDecode from 'jwt-decode'

function defaultState() {
	return {
		isAuthorized: JSON.parse(localStorage.getItem('auth/isAuthorized')) || false,
		isAuthorizing: false,
		token: localStorage.getItem('auth/token') || '',
		tokenRefresherIntervalId: null,
		isGettingNewToken: false,
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
		setToken(state, token) {
			state.token = token
			localStorage.setItem('auth/token', token)
		},
		setTokenRefresherIntervalId(state, interval) {
			state.tokenRefresherIntervalId = interval
		},
		setIsGettingNewToken(state, bool) {
			state.isGettingNewToken = bool
		},
		dropState(state) {
			Object.assign(state, defaultState())
		},
	},
	actions: {
		dropToDefaults({ commit, dispatch }) {
			dispatch('clearCache')
			commit('dropState')
		},
		clearCache() {
			Object.keys(defaultState()).forEach(key => {
				localStorage.removeItem(`auth/${key}`)
			})
		},
		async authenticate({ state, commit, dispatch }, credentials) {
			try {
				commit('setIsAuthorizing', true)

				let token = ''

				if (credentials.refresh) {
					commit('setIsGettingNewToken', true)
					token = (await http.post('auth/refresh')).data
					commit('setIsGettingNewToken', false)
				} else token = (await http.post('auth/authenticate', credentials)).data

				const user = jwtDecode(token)

				commit('setToken', token)
				dispatch('setAuthHeader')
				commit('users/setUser', user, { root: true })
				commit('setIsAuthorized', true)
				dispatch('runTokenRefresher')
			} catch (error) {
				if (state.isAuthorized) await dispatch('unauthorize')
				throw error
			} finally {
				commit('setIsAuthorizing', false)
			}
		},
		async unauthorize({ dispatch, rootState }) {
			dispatch('clearTokenRefresherInterval')

			Object.keys(rootState).forEach(moduleName => {
				dispatch(`${moduleName}/dropToDefaults`, null, { root: true })
			})

			dispatch('setAuthHeader')
		},
		setAuthHeader({ state }) {
			http.defaults.headers.common.Authorization = state.token ? `Bearer ${state.token}` : ''
		},
		setHttpHooks({ dispatch }) {
			http.interceptors.response.use(response => response, async error => {
				if (error.response.status === 401) {
					await dispatch('unauthorize')
					error.disableUserNotice = true
				}

				throw error
			})
		},
		runTokenRefresher({ state, commit, dispatch, rootState }) {
			if (state.tokenRefresherIntervalId) return

			const oneMinuteInMilliseconds = 1000
			const oneHourInSeconds = 60 * 60

			const tokenRefresherIntervalId = setInterval(async () => {
				const secondsLeft = rootState.users.user.exp - Math.round(new Date() / 1000)

				if (secondsLeft < (oneHourInSeconds * 3) && !state.isGettingNewToken) {
					dispatch('clearTokenRefresherInterval')
					await dispatch('authenticate', { refresh: true })
				}

				if (Number.isNaN(secondsLeft) || secondsLeft <= 0) dispatch('unauthorize')
			}, oneMinuteInMilliseconds * 20)

			commit('setTokenRefresherIntervalId', tokenRefresherIntervalId)
		},
		clearTokenRefresherInterval({ state, commit }) {
			clearInterval(state.tokenRefresherIntervalId)
			commit('setTokenRefresherIntervalId', null)
		},
	},
}