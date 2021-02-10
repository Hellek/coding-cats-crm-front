<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<Accounts/>
			</el-form-item>

			<el-form-item>
				<el-date-picker
					v-model="operationDatesProxy"
					type="datetimerange"
					:default-time="['10:00:00', '02:00:00']"
					format="dd.MM.yyyy HH:mm:ss"
					range-separator="по"
					:clearable="false"
				/>
			</el-form-item>

			<el-form-item>
				<FigiSelect @selected="filter.figi = $event"/>
			</el-form-item>
		</el-form>

		<el-table
			v-if="brokerAccountId"
			v-loading="isInstrumentsLoading && isOperationsLoading"
			:data="buySellOperationsPaginated"
			size="mini"
			border
			stripe
		>
			<el-table-column type="expand">
				<template slot-scope="props">
					<div
						v-if="props.row.trades && props.row.trades.length"
						class="mb-2"
					>
						<h5 class="mb-2">Сделки:</h5>

						<div
							v-for="(trade, i) in props.row.trades"
							:key="trade.tradeId"
							class="mb-2"
						>{{ i + 1 }}) {{ trade.quantity }} по {{ trade.price }}</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column
				label="Тикер"
				prop="ticker"
			/>

			<el-table-column
				label="Платёж | комиссия"
				width="160px"
			>
				<template slot-scope="scope">
					<div
						v-if="scope.row.status === 'Decline'"
						class="color-danger"
					>Отменена</div>

					<div
						v-else
						class="d-flex justify-content-between"
					>
						<div>{{ scope.row.payment }} {{ getCurrencySymbol(scope.row.currency) }}</div>
						<div class="color-info font-size-12">{{ scope.row.commission ? scope.row.commission.value : '------' }}</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column
				label="Действие"
				width="120px"
				:formatter="formatOperationType"
			/>

			<el-table-column label="Инструмент" :formatter="formatInstrumentType"/>
			<el-table-column label="Исполнено" :formatter="formatQuantity"/>
			<el-table-column label="Дата" :formatter="formatDate"/>
		</el-table>

		<el-pagination
			v-if="buySellOperations.length"
			:current-page.sync="localFilter.currentPage"
			:page-size.sync="localFilter.pageSize"
			:page-sizes="[10, localFilter.pageSize, 50, 100, 200, 400]"
			layout="total, sizes, prev, pager, next"
			:total="buySellOperations.length"
			background
		/>
	</div>
</template>

<script>
import Accounts from 'Components/TinkoffInvest/Accounts'
import FigiSelect from 'Components/TinkoffInvest/FigiSelect'
import { mapState } from 'vuex'
import { toDateTimeFormat } from 'Utils'

import {
	fetchOperations,
	getCurrencySymbol,
} from 'Helpers/methods'

export default {
	name: 'Operations',
	components: {
		Accounts,
		FigiSelect,
	},
	data() {
		return {
			isOperationsLoading: false,
			operations: [],
			filter: {
				from: null,
				to: null,
				figi: null,
			},
			localFilter: {
				currentPage: 1,
				pageSize: 20,
			},
			instrumentTypeProxy: {
				Stock: 'stocks',
				Bond: 'bonds',
				Etf: 'etfs',
				Currency: 'currencies',
			},
		}
	},
	computed: {
		...mapState('tinkoffInvest', [
			'brokerAccountId',
			'isInstrumentsLoading',
			'instruments',
		]),
		operationDatesProxy: {
			set(period) {
				[this.filter.from, this.filter.to] = period
			},
			get() {
				return [this.filter.from, this.filter.to]
			},
		},
		buySellOperations() {
			return this.operations.filter(o => ['Buy', 'Sell'].includes(o.operationType))
		},
		buySellOperationsPaginated() {
			const figiTickerMap = {}

			return this.buySellOperations
				.slice((this.localFilter.currentPage - 1) * this.localFilter.pageSize, this.localFilter.currentPage * this.localFilter.pageSize)
				.map(o => {
					// Берём из кэша найденные ранее по figi тикер
					if (figiTickerMap[o.figi]) o.ticker = figiTickerMap[o.figi]
					else {
						figiTickerMap[o.figi] = this.instruments[this.instrumentTypeProxy[o.instrumentType]].find(i => i.figi === o.figi).ticker
						o.ticker = figiTickerMap[o.figi]
					}

					return o
				})
		},
	},
	watch: {
		brokerAccountId: 'setOperations',
		filter: {
			deep: true,
			handler: 'setOperations',
		},
	},
	async created() {
		this.setTime()
		await this.$store.dispatch('tinkoffInvest/setAllInstuments')
		this.setOperations()
	},
	methods: {
		fetchOperations,
		getCurrencySymbol,
		setTime() {
			const hour = this.$dayjs().hour()
			const showFinishedSession = hour < 6
			const startOfDay = this.$dayjs().startOf('day')

			this.filter.from = startOfDay.add(showFinishedSession ? -1 : 0, 'day').hour(10).format()
			this.filter.to = startOfDay.add(showFinishedSession ? 0 : 1, 'day').hour(2).format()
		},
		async setOperations() {
			if (!this.brokerAccountId || !this.filter.from) return

			this.isOperationsLoading = true

			try {
				this.operations = await this.fetchOperations({
					...this.filter,
					brokerAccountId: this.brokerAccountId,
				})
			} catch (error) {
				this.$notifyUserAboutError(error)
			} finally {
				this.isOperationsLoading = false
			}
		},
		formatOperationType(row) {
			switch (row.operationType) {
			case 'Buy': return 'Покупка'
			case 'Sell': return 'Продажа'
			case 'BrokerCommission': return 'Комиссия брокера'
			case 'MarginCommission': return 'Комиссия за маржу'
			case 'PayIn': return 'Пополнение счёта'
			case 'PayOut': return 'Вывод денег со счёта'
			default: return row.operationType
			}
		},
		formatDate(row) {
			return toDateTimeFormat(row.date)
		},
		formatInstrumentType(row) {
			switch (row.instrumentType) {
			case 'Stock': return 'Акция'
			case 'Bond': return 'Облигация'
			case 'Etf': return 'ETF'
			case 'Currency': return 'Валюта'
			default: return row.instrumentType
			}
		},
		formatQuantity(row) {
			if (!row.quantityExecuted) return ''
			const qty = (row.quantity === row.quantityExecuted) ? row.quantity : `${row.quantity} из ${row.quantityExecuted}`
			return `${qty} по ${row.price} ${this.getCurrencySymbol(row.currency)}`
		},
	},
}
</script>