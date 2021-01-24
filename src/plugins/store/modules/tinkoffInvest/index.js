function defaultState() {
	return {
		sandboxToken: localStorage.getItem('tinkoffInvest/sandboxToken') || '',
		realToken: localStorage.getItem('tinkoffInvest/realToken') || '',
	}
}

export default {
	namespaced: true,
	state: defaultState(),
	mutations: {
		setSandboxToken(state, token) {
			state.sandboxToken = token
			localStorage.setItem('tinkoffInvest/sandboxToken', token)
		},
		setRealToken(state, token) {
			state.realToken = token
			localStorage.setItem('tinkoffInvest/realToken', token)
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
				localStorage.removeItem(`tinkoffInvest/${key}`)
			})
		},
	},
}