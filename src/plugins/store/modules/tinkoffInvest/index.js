function defaultState() {
	return {
		sandboxToken: localStorage.getItem('tinkoffInvest/sandboxToken') || '',
		realToken: localStorage.getItem('tinkoffInvest/realToken') || '',
		brokerAccountId: localStorage.getItem('tinkoffInvest/brokerAccountId') || null,
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
		setBrokerAccountId(state, brokerAccountId) {
			state.brokerAccountId = brokerAccountId
			localStorage.setItem('tinkoffInvest/brokerAccountId', brokerAccountId)
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