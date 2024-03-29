import { http } from 'KitPlugins/http'
import { getSessionTime } from 'Utils'

function defaultState() {
	return {
		brokerAccountId: localStorage.getItem('tinkoffInvest/brokerAccountId') || null,
		filter: {
			...getSessionTime(),
			figi: null,
		},
		isInstrumentsLoading: false,
		isUsedFigiListLoading: false,
		isSyncProcess: false,
		isOperationsLoading: false,
		isAccountsLoading: false,
		isPortfolioLoading: false,
		instruments: {
			stocks: [],
			bonds: [],
			etfs: [],
			currencies: [],
		},
		operations: [],
		accounts: JSON.parse(localStorage.getItem('tinkoffInvest/accounts')) || [],
		portfolio: {},
		figiMap: {},
		usedFigiList: [],
	}
}

export default {
	namespaced: true,
	state: defaultState(),
	getters: {
		usedInstrumentsFlat: state => [
			...state.instruments.stocks.filter(i => state.usedFigiList.includes(i.figi)),
			...state.instruments.bonds.filter(i => state.usedFigiList.includes(i.figi)),
			...state.instruments.etfs.filter(i => state.usedFigiList.includes(i.figi)),
			...state.instruments.currencies.filter(i => state.usedFigiList.includes(i.figi)),
		],
	},
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
		setIsUsedFigiListLoading(state, isUsedFigiListLoading) {
			state.isUsedFigiListLoading = isUsedFigiListLoading
		},
		setIsSyncProcess(state, isSyncProcess) {
			state.isSyncProcess = isSyncProcess
		},
		setOperations(state, operations) {
			state.operations = operations
		},
		setUsedFigiList(state, usedFigiList) {
			state.usedFigiList = usedFigiList
		},
		setAccounts(state, accounts) {
			state.accounts = accounts
			localStorage.setItem('tinkoffInvest/accounts', JSON.stringify(accounts))
		},
		setPortfolio(state, portfolio) {
			state.portfolio = portfolio
		},
		setFilterFigi(state, figi) {
			state.filter.figi = figi
		},
		setFilterTime(state, { from, to }) {
			state.filter.from = from
			state.filter.to = to
		},
		setIsAccountsLoading(state, isAccountsLoading) {
			state.isAccountsLoading = isAccountsLoading
		},
		setIsPortfolioLoading(state, isPortfolioLoading) {
			state.isPortfolioLoading = isPortfolioLoading
		},
		setFigiMap(state, figiMap) {
			state.figiMap = figiMap
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

				const figiMap = {}

				Object.keys(state.instruments).forEach(iName => {
					state.instruments[iName].forEach(i => {
						figiMap[i.figi] = i
					})
				})

				commit('setFigiMap', figiMap)
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
			commit('setIsSyncProcess', true)

			try {
				return (await http.post('tinkoff-investments/operations/sync', {
					brokerAccountId: state.brokerAccountId,
				})).data
			} finally {
				commit('setIsSyncProcess', false)
			}
		},
		async setAccounts({ state, commit }) {
			try {
				let accounts = JSON.parse(localStorage.getItem('tinkoffInvest/accounts'))

				if (!accounts) {
					commit('setIsAccountsLoading', true)

					accounts = (await http.get('tinkoff-investments/accounts')).data

					accounts.forEach(acc => {
						switch (acc.brokerAccountType) {
						case 'Tinkoff': acc.label = 'Основной счёт'; break
						case 'TinkoffIis': acc.label = 'ИИС'; break
						default: break
						}
					})
				}

				commit('setAccounts', accounts)

				// Устанавливаем счет по умолчанию, если не было
				if (!state.brokerAccountId && accounts[0]) {
					commit('setBrokerAccountId', accounts[0].brokerAccountId)
				}
			} finally {
				commit('setIsAccountsLoading', false)
			}
		},
		async setUsedInstruments({ commit }) {
			commit('setIsUsedFigiListLoading', true)
			commit('setUsedFigiList', (await http.get('tinkoff-investments/used-instruments')).data)
			commit('setIsUsedFigiListLoading', false)
		},
		async setPortfolio({ state, commit }) {
			commit('setIsPortfolioLoading', true)

			const { data } = await http.get('tinkoff-investments/portfolio', {
				params: {
					brokerAccountId: state.brokerAccountId,
				},
			})

			commit('setPortfolio', data)
			commit('setIsPortfolioLoading', false)
		},
		async fetchInstrumentPortfolio({ state }, figi) {
			return (await http.get('tinkoff-investments/portfolio/instrument', {
				params: {
					brokerAccountId: state.brokerAccountId,
					figi,
				},
			})).data
		},
		async removeOperations({ commit }) {
			await http.delete('tinkoff-investments/operations')
			commit('setOperations', [])
		},
	},
}