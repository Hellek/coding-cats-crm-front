export async function fetchUsers() {
	return (await this.$http.get('/users')).data
}

export async function fetchOperations({
	from,
	to,
	figi = null,
	brokerAccountId,
}) {
	return (await this.$http.get('tinkoff-investments/operations', {
		params: {
			from,
			to,
			figi,
			brokerAccountId,
		},
	})).data
}

export async function syncOperations() {
	return (await this.$http.post('tinkoff-investments/operations/sync')).data
}

export function getCurrencySymbol(currency) {
	switch (currency) {
	case 'USD': return '$'
	case 'RUB': return '₽'
	case 'EUR': return '€'
	default: return ''
	}
}