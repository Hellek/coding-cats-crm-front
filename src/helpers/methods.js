export async function fetchUsers() {
	return (await this.$http.get('/users')).data
}