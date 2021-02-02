<template>
	<el-card v-loading="instrumentsLoading">
		<el-tabs
			v-model="instrumentType"
			type="card"
			@tab-click="setInstrumentType"
		>
			<el-tab-pane
				v-for="(label, type) in instrumentTypes"
				:key="type"
				:label="label"
				:name="type"
			>
				<el-table
					:data="instruments[instrumentType]"
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
const instrumentTypes = {
	stocks: 'Акции',
	currencies: 'Валюты',
	etfs: 'ETF',
	bonds: 'Облигации',
}

export default {
	name: 'Instruments',
	data() {
		return {
			instrumentsLoading: true,
			instrumentType: '',
			instrumentTypes,
			instruments: {},
		}
	},
	watch: {
		instrumentType: 'setInstumentsByType',
	},
	created() {
		if (this.$route.query.instrumentType) this.instrumentType = this.$route.query.instrumentType
		else this.setInstrumentType({ name: 'stocks' })
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
		async setInstumentsByType(type) {
			this.instrumentsLoading = true

			try {
				if (this.instruments[type]) return

				const { data } = await this.$http.get(`tinkoff-investments/instruments/${type}`)

				this.$set(this.instruments, type, data)
			} catch (error) {
				this.$notifyUserAboutError(error)
			} finally {
				this.instrumentsLoading = false
			}
		},
	},
}
</script>