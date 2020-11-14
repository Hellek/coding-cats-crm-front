<template>
	<div>
		<router-link to="/user/creation">Создать пользователя</router-link>

		<el-table
			:data="users"
			stripe
		>
			<el-table-column prop="id" label="ID">
				<router-link
					slot-scope="scope"
					:to="`/user/${scope.row.id}`"
				>{{ scope.row.id }}</router-link>
			</el-table-column>
			<el-table-column
				v-for="col in tableColumns"
				:key="col.prop"
				:prop="col.prop"
				:label="col.label"
			/>
		</el-table>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { toDateTimeFormat } from 'Utils'

export default {
	name: 'Users',
	data() {
		return {
			users: [],
			tableColumns: [
				{ prop: 'firstName', label: 'Имя' },
				{ prop: 'lastName', label: 'Фамилия' },
				{ prop: 'phone', label: 'Телефон' },
				{ prop: 'email', label: 'Почта' },
				{ prop: 'registered', label: 'Зарегистрирован' },
				{ prop: 'role.label', label: 'Роль' },
				{ prop: 'active.label', label: 'Активен' },
			],
		}
	},
	computed: {
		...mapState({
			roles: state => state.roles.list,
			activeStatusList: state => state.users.activeStatusList,
		}),
	},
	created() {
		this.fetchRoles()
		this.getUsers()
	},
	methods: {
		toDateTimeFormat,
		...mapActions({
			fetchRoles: 'roles/fetchRoles',
		}),
		async getUsers() {
			const users = (await this.$http.get('/users/list')).data

			this.users = users.map(user => {
				user.role = this.roles[user.role]
				user.active = this.activeStatusList[user.active]
				user.registered = this.toDateTimeFormat(user.registered)

				return user
			})
		},
	},
}
</script>