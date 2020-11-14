import { fetchUsers } from 'Helpers/methods'

export const setUsers = {
	data() {
		return {
			users: [],
		}
	},
	methods: {
		fetchUsers,
		async setUsers() {
			try {
				const users = await this.fetchUsers()
				this.users = users.sort((a, b) => a.id - b.id)
			} catch (error) {
				this.$notifyUserAboutError(error.message)
			}
		},
	},
}