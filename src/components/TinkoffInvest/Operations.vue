<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<el-date-picker
					v-model="operationsDateProxy"
					type="daterange"
					range-separator="по"
					:clearable="false"
				/>
			</el-form-item>

			<el-form-item class="ml-4">
				<el-select
					v-model="operationsFilter.figi"
					placeholder="FIGI"
					clearable
					filterable
				>
					<el-option
						v-for="i in figiList"
						:key="i.figi"
						:label="`${i.ticker} (${i.name})`"
						:value="i.figi"
					/>
				</el-select>
			</el-form-item>
		</el-form>

		<el-table
			v-loading="isOperationsLoading"
			:data="operations"
			size="mini"
			border
			stripe
		>
			<el-table-column type="expand">
				<template slot-scope="props">
					<div class="mb-2">Комиссия: {{ props.row.commission ? props.row.commission : '-' }}</div>
					<div class="mb-2">Сделки: {{ props.row.trades ? props.row.trades : '-' }}</div>
					<div class="mb-2">FIGI: {{ props.row.figi }}</div>
				</template>
			</el-table-column>
			<el-table-column label="Тип операции" :formatter="formatOperationType"/>
			<el-table-column label="Дата" :formatter="formatDate"/>
			<el-table-column label="Инструмент" :formatter="formatInstrumentType"/>
			<el-table-column label="Тикер" :formatter="formatFigi"/>
			<el-table-column label="Лотов в заявке" prop="quantity"/>
			<el-table-column label="Лотов исполнено" prop="quantityExecuted"/>
			<el-table-column label="Цена" :formatter="formatPrice"/>
			<el-table-column label="Платёж" :formatter="formatPayment"/>
			<el-table-column label="Статус" :formatter="formatStatus"/>
		</el-table>
	</div>
</template>

<script>
import { toDateTimeFormat } from 'Utils'

export default {
	name: 'Operations',
	props: {
		api: {
			type: Function,
			required: true,
		},
		account: {
			type: String,
			required: true,
		},
		stocks: {
			type: Array,
			required: true,
		},
		bonds: {
			type: Array,
			required: true,
		},
		etfs: {
			type: Array,
			required: true,
		},
		currencies: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			isOperationsLoading: false,
			operations: [],
			operationsFilter: {
				from: this.$dayjs().startOf('day').format(),
				to: this.$dayjs().endOf('day').format(),
				figi: null,
				brokerAccountId: null,
			},
		}
	},
	computed: {
		operationsDateProxy: {
			set(period) {
				[this.operationsFilter.from, this.operationsFilter.to] = period
			},
			get() {
				return [this.operationsFilter.from, this.operationsFilter.to]
			},
		},
		figiList() {
			return [
				...this.stocks,
				...this.bonds,
				...this.etfs,
				...this.currencies,
			]
		},
	},
	watch: {
		account: 'setOperations',
		operationsFilter: {
			immediate: true,
			deep: true,
			handler: 'setOperations',
		},
	},
	methods: {
		async fetchOperations({ from, to, figi = null }) {
			const { data } = await this.api.get('operations', {
				params: {
					from,
					to,
					figi,
					brokerAccountId: this.account,
				},
			})

			return data.payload.operations
		},
		async setOperations(filter = {}) {
			try {
				this.isOperationsLoading = true
				this.operations = await this.fetchOperations({ ...this.operationsFilter, ...filter })
			} catch (error) {
				this.$notifyUserAboutError(error)
			} finally {
				this.isOperationsLoading = false
			}
		},
		getCurrencySymbol(currency) {
			switch (currency) {
			case 'USD': return '$'
			case 'RUB': return '₽'
			case 'EUR': return '€'
			default: return ''
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
		formatFigi(row) {
			switch (row.instrumentType) {
			case 'Stock': return this.stocks.find(i => i.figi === row.figi).ticker
			case 'Bond': return this.bonds.find(i => i.figi === row.figi).name
			case 'Etf': return this.etfs.find(i => i.figi === row.figi).name
			case 'Currency': return this.currencies.find(i => i.figi === row.figi).name
			default: return row.figi
			}
		},
		formatPrice(row) {
			return row.price ? `${row.price} ${this.getCurrencySymbol(row.currency)}` : ''
		},
		formatPayment(row) {
			return row.payment ? `${row.payment} ${this.getCurrencySymbol(row.currency)}` : ''
		},
		formatStatus(row) {
			switch (row.status) {
			case 'Done': return 'Исполнена'
			case 'Decline': return 'Отменена'
			default: return row.status
			}
		},
	},
}
</script>