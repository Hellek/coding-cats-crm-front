<template>
	<div>
		<router-link :to="{ name: 'User' }">Создать пользователя</router-link>

		<el-table
			:data="users"
			stripe
			class="mt-4"
		>
			<el-table-column label="ID">
				<router-link
					slot-scope="scope"
					:to="{ name: 'User', params: { id: scope.row.id } }"
				>
					<el-button
						plain
						size="mini"
					>{{ scope.row.id }}</el-button>
				</router-link>
			</el-table-column>

			<el-table-column
				v-for="col in tableColumns"
				:key="col.prop"
				:prop="col.prop"
				:label="col.label"
			/>

			<el-table-column label="Активен">
				<template slot-scope="scope">{{ scope.row.active ? 'Да' : 'Нет' }}</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import { setUsers } from 'Mixins/setMixins'

export default {
	name: 'Users',
	mixins: [
		setUsers,
	],
	data() {
		return {
			tableColumns: [
				{ prop: 'firstName', label: 'Имя' },
				{ prop: 'lastName', label: 'Фамилия' },
				{ prop: 'phone', label: 'Телефон' },
				{ prop: 'email', label: 'Почта' },
			],
		}
	},
	async created() {
		await this.setUsers()
	},
}
</script>