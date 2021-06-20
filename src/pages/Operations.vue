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
				<FigiSelect v-model="filter.figi"/>
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
import { instrumentTypeNames, operationTypeNames } from 'Plugins/i18n'

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
			instrumentTypeNames,
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
			'figiMap',
		]),
		...mapState({
			isOperationsLoading: state => state.tinkoffInvest.isOperationsLoading,
			operations: state => state.tinkoffInvest.operations,
		}),
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
			return this.buySellOperations
				.slice((this.localFilter.currentPage - 1) * this.localFilter.pageSize, this.localFilter.currentPage * this.localFilter.pageSize)
				.map(o => {
					o.ticker = this.figiMap[o.figi].ticker
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
	created() {
		this.setTime()
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

			this.fetchOperations({
				...this.filter,
				brokerAccountId: this.brokerAccountId,
			})
		},
		formatOperationType(row) {
			return operationTypeNames[row.operationType]
		},
		formatDate(row) {
			return toDateTimeFormat(row.date)
		},
		formatInstrumentType(row) {
			return this.instrumentTypeNames.singular[row.instrumentType]
		},
		formatQuantity(row) {
			if (!row.quantityExecuted) return ''
			const qty = (row.quantity === row.quantityExecuted) ? row.quantity : `${row.quantity} из ${row.quantityExecuted}`
			return `${qty} по ${row.price} ${this.getCurrencySymbol(row.currency)}`
		},
	},
}
</script>