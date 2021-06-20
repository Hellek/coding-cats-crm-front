<template>
	<el-card v-loading="isInstrumentsLoading">
		<el-tabs
			v-model="instrumentType"
			type="card"
			@tab-click="setInstrumentType"
		>
			<el-tab-pane
				v-for="(label, type) in instrumentTypeNames.plural"
				:key="type"
				:label="label"
				:name="type"
			>
				<el-pagination
					:current-page.sync="localFilter.currentPage"
					:page-size.sync="localFilter.pageSize"
					:page-sizes="[10, localFilter.pageSize, 50, 100, 200, 400]"
					layout="total, sizes, prev, pager, next"
					:total="instruments[instrumentType].length"
					background
				/>

				<el-table
					:data="instrumentsPaginated"
					stripe
				>
					<el-table-column prop="ticker" label="Тикер"/>
					<el-table-column prop="name" label="Название"/>

					<el-table-column
						v-if="instrumentType === 'bonds'"
						prop="faceValue"
						label="Номинал"
					/>

					<el-table-column prop="currency" label="Валюта"/>
					<el-table-column prop="lot" label="Размер лота"/>
					<el-table-column prop="minPriceIncrement" label="Шаг цены"/>
					<el-table-column prop="figi" label="figi"/>

					<el-table-column
						v-if="['stocks', 'etfs', 'bonds'].includes(instrumentType)"
						prop="isin"
						label="isin"
					/>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</el-card>
</template>

<script>
import { mapState } from 'vuex'
import { instrumentTypeNames } from 'Plugins/i18n'

export default {
	name: 'Instruments',
	data() {
		return {
			instrumentTypeNames,
			instrumentType: '',
			localFilter: {
				currentPage: 1,
				pageSize: 15,
			},
		}
	},
	computed: {
		...mapState('tinkoffInvest', [
			'isInstrumentsLoading',
			'instruments',
		]),
		instrumentsPaginated() {
			return this.instruments[this.instrumentType]
				.slice((this.localFilter.currentPage - 1) * this.localFilter.pageSize, this.localFilter.currentPage * this.localFilter.pageSize)
		},
	},
	created() {
		if (this.$route.query.instrumentType) this.instrumentType = this.$route.query.instrumentType
		else this.setInstrumentType({ name: 'currencies' })
	},
	methods: {
		setInstrumentType(tab) {
			if (this.$route.query.instrumentType === tab.name) return
			if (this.instrumentType !== tab.name) this.instrumentType = tab.name

			this.$router.replace({
				query: {
					...this.$route.query,
					instrumentType: tab.name,
				},
			})
		},
	},
}
</script>