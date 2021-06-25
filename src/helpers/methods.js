export async function fetchUsers() {
	return (await this.$http.get('/users')).data
}

export async function fetchOperations() {
	const { brokerAccountId, filter } = this.$store.state.tinkoffInvest
	if (!brokerAccountId || !filter.from) return

	try {
		await this.$store.dispatch('tinkoffInvest/fetchOperations', {
			...filter,
			brokerAccountId,
		})
	} catch (error) {
		this.$notifyUserAboutError(error)
	}
}

export async function syncOperations(attempts = 3) {
	try {
		const { added } = await this.$store.dispatch('tinkoffInvest/syncOperations')

		if (added === 0) return

		this.$notify.success({
			title: 'Операции синхронизированы',
			message: `${added} новых записей`,
		})
	} catch (error) {
		if (attempts > 0) {
			syncOperations(attempts - 1)
		} else {
			this.$notifyUserAboutError('Ошибка синхронизации сделок')
		}
	}
}

export function getCurrencySymbol(currency) {
	switch (currency) {
	case 'USD': return '$'
	case 'RUB': return '₽'
	case 'EUR': return '€'
	default: return ''
	}
}