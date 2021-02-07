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