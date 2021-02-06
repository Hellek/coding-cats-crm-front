import { http } from 'KitPlugins/http'

function defaultState() {
	return {
		brokerAccountId: localStorage.getItem('tinkoffInvest/brokerAccountId') || null,
		isInstrumentsLoading: false,
		instruments: {
			stocks: [],
			bonds: [],
			etfs: [],
			currencies: [],
		},
	}
}

export default {
	namespaced: true,
	state: defaultState(),
	mutations: {
		setBrokerAccountId(state, brokerAccountId) {
			state.brokerAccountId = brokerAccountId
			localStorage.setItem('tinkoffInvest/brokerAccountId', brokerAccountId)
		},
		setIsInstrumentsLoading(state, isInstrumentsLoading) {
			state.isInstrumentsLoading = isInstrumentsLoading
		},
		setInstumentByType(state, { type, instruments }) {
			state.instruments[type] = instruments
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
		async setInstumentsByType({ state, commit }, type) {
			if (state.instruments[type].length) return

			const instruments = (await http.get(`tinkoff-investments/instruments/${type}`)).data

			commit('setInstumentByType', { type, instruments })
		},
		async setAllInstuments({ state, commit, dispatch }) {
			try {
				commit('setIsInstrumentsLoading', true)

				const promises = []

				Object.keys(state.instruments).forEach(iName => {
					promises.push(dispatch('setInstumentsByType', iName))
				})

				await Promise.all(promises)
			} finally {
				commit('setIsInstrumentsLoading', false)
			}
		},
	},
}