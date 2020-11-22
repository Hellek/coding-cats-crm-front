<template>
	<div>
		<!-- <router-link :to="{ name: 'Role' }">
			<el-button type="primary">Создать роль</el-button>
		</router-link> -->

		<el-table
			v-loading="isLoading"
			:data="roles"
			stripe
			class="mt-4"
		>
			<!-- <el-table-column label="ID">
				<router-link
					slot-scope="scope"
					:to="{ name: 'Role', params: { id: scope.row.id } }"
				>
					<el-button
						plain
						size="mini"
					>{{ scope.row.id }}</el-button>
				</router-link>
			</el-table-column> -->

			<el-table-column
				v-for="col in tableColumns"
				:key="col.prop"
				:prop="col.prop"
				:label="col.label"
				:formatter="col.formatter"
			/>
		</el-table>
	</div>
</template>

<script>
export default {
	name: 'Roles',
	data() {
		return {
			isLoading: true,
			roles: [],
			tableColumns: [
				{ prop: 'id', label: 'ID' },
				{ prop: 'label', label: 'Название' },
				{
					prop: 'rights',
					label: 'Права доступа',
					formatter: column => JSON.stringify(column.rights),
				},
			],
		}
	},
	created() {
		this.isLoading = true
		this.setRoles()
		this.isLoading = false
	},
	methods: {
		async setRoles() {
			this.roles = (await this.$http.get('/roles')).data
		},
	},
}
</script>