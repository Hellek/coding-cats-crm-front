import { http } from 'KitPlugins/http'

function defaultState() {
	return {
		brokerAccountId: localStorage.getItem('tinkoffInvest/brokerAccountId') || null,
		isInstrumentsLoading: false,
		isOperationsLoading: false,
		instruments: {
			stocks: [],
			bonds: [],
			etfs: [],
			currencies: [],
		},
		operations: [],
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
		setIsOperationsLoading(state, isOperationsLoading) {
			state.isOperationsLoading = isOperationsLoading
		},
		setOperations(state, operations) {
			state.operations = operations
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
			if (state.isInstrumentsLoading) return

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
		async fetchOperations({ commit }, {
			from = null,
			to = null,
			figi = null,
			brokerAccountId = null,
		}) {
			commit('setIsOperationsLoading', true)

			try {
				const { data } = await http.get('tinkoff-investments/operations', {
					params: {
						from,
						to,
						figi,
						brokerAccountId,
					},
				})

				commit('setOperations', data)
			} finally {
				commit('setIsOperationsLoading', false)
			}
		},
		async syncOperations({ state, commit }) {
			commit('setIsOperationsLoading', true)

			try {
				return (await http.post('tinkoff-investments/operations/sync', {
					brokerAccountId: state.brokerAccountId,
				})).data
			} finally {
				commit('setIsOperationsLoading', false)
			}
		},
	},
}