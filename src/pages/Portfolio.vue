<template>
	<el-card v-loading="isPortfolioLoading">
		<Accounts class="mb-5"/>

		<el-table
			:data="portfolio.positions"
			:fit="false"
			stripe
		>
			<el-table-column type="expand">
				<template slot-scope="props">
					<div class="mb-2">Тип инструмента: {{ props.row.instrumentType }}</div>
					<div class="mb-2">Лотов: {{ props.row.lots }}</div>
					<div class="mb-2">FIGI: {{ props.row.figi }}</div>
					<div>ISIN: {{ props.row.isin }}</div>
				</template>
			</el-table-column>

			<el-table-column
				label="Тикер"
				prop="ticker"
				width="140px"
			/>

			<el-table-column
				label="Название"
				prop="name"
				width="230px"
			/>

			<el-table-column
				label="Баланс"
				prop="balance"
				width="100px"
			/>

			<el-table-column label="Доход" width="110px">
				<template slot-scope="scope">
					<span
						:class="scope.row.expectedYield.value > 0 ? 'color-success' : 'color-danger'"
					>{{ scope.row.expectedYield.value }} {{ getCurrencySymbol(scope.row.expectedYield.currency) }}</span>
				</template>
			</el-table-column>

			<el-table-column label="Средняя" width="110px">
				<template slot-scope="scope">{{ scope.row.averagePositionPrice.value }} {{ getCurrencySymbol(scope.row.averagePositionPrice.currency) }}</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
import Accounts from 'Components/TinkoffInvest/Accounts'
import { mapState, mapActions } from 'vuex'
import { getCurrencySymbol } from 'Helpers/methods'

export default {
	name: 'Portfolio',
	components: {
		Accounts,
	},
	computed: {
		...mapState('tinkoffInvest', [
			'brokerAccountId',
			'isPortfolioLoading',
			'portfolio',
		]),
	},
	watch: {
		brokerAccountId: {
			immediate: true,
			handler: 'setPortfolio',
		},
	},
	methods: {
		getCurrencySymbol,
		...mapActions({
			setPortfolio: 'tinkoffInvest/setPortfolio',
		}),
	},
}
</script>