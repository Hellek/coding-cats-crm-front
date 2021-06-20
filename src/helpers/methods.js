export async function fetchUsers() {
	return (await this.$http.get('/users')).data
}

export async function fetchOperations(params) {
	try {
		await this.$store.dispatch('tinkoffInvest/fetchOperations', params)
	} catch (error) {
		this.$notifyUserAboutError(error)
	}
}

export async function syncOperations() {
	try {
		const { added } = await this.$store.dispatch('tinkoffInvest/syncOperations')

		if (added === 0) return

		this.$notify.success({
			title: 'Операции синхронизированы',
			message: `${added} новых записей`,
		})
	} catch (error) {
		this.$notifyUserAboutError(error)
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