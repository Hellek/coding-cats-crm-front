<template>
	<div>
		<router-link :to="{ name: 'Idea' }">
			<el-button type="primary">Добавить идею</el-button>
		</router-link>

		<el-card
			shadow="always"
			:body-style="{ padding: 0 }"
			class="mt-4"
		>
			<div class="p-4">
				<el-select v-model="filter.active">
					<el-option
						v-for="item in activeList"
						:key="item.label"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</div>

			<el-table
				v-loading="isLoading"
				:data="filteredIdeas"
				stripe
			>
				<el-table-column label="ID">
					<router-link
						slot-scope="scope"
						:to="{ name: 'Idea', params: { id: scope.row.id } }"
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
					:formatter="col.formatter"
				/>
			</el-table>
		</el-card>
	</div>
</template>

<script>
import { toDateTimeFormat } from 'Utils'

export default {
	name: 'Journal',
	data() {
		return {
			isLoading: true,
			ideas: [],
			tableColumns: [
				{ prop: 'ticker', label: 'Тикер' },
				{ prop: 'created', label: 'Создана', formatter: row => toDateTimeFormat(row.created) },
			],
			filter: {
				active: true,
			},
			activeList: [
				{ label: 'Актуальные', value: true },
				{ label: 'Завершенные', value: false },
			],
		}
	},
	computed: {
		filteredIdeas() {
			return this.ideas.filter(idea => idea.active === this.filter.active)
		},
	},
	async created() {
		this.isLoading = true
		await this.setIdeas()
		this.isLoading = false
	},
	methods: {
		async setIdeas() {
			try {
				this.ideas = (await this.$http.get('ideas')).data
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
	},
}
</script>