<template>
	<div>
		<router-link to="/role/creation">Создать роль</router-link>

		<el-table
			:data="rolesAsArray"
			stripe
		>
			<el-table-column prop="id" label="ID">
				<router-link
					slot-scope="scope"
					:to="`/role/${scope.row.id}`"
				>{{ scope.row.id }}</router-link>
			</el-table-column>
			<el-table-column prop="label" label="Название"/>
		</el-table>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
	name: 'Roles',
	computed: {
		...mapState({
			roles: state => state.roles.list,
		}),
		rolesAsArray() {
			return Object.values(this.roles)
		},
	},
	created() {
		this.fetchRoles()
	},
	methods: {
		...mapActions({
			fetchRoles: 'roles/fetchRoles',
		}),
	},
}
</script>