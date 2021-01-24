function defaultState() {
	return {
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
				localStorage.removeItem(`users/${key}`)
			})
		},
	},
}