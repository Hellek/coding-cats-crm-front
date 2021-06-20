<template>
	<div class="h-100p d-flex flex-column">
		<div>
			<Accounts class="mb-4 mr-3"/>

			<FigiSelect
				v-model="filter.figi"
				class="mb-4"
			/>
		</div>

		<el-card
			v-if="isOperationsLoading || operations.length"
			v-loading="isOperationsLoading"
			class="flex-grow"
		>
			<template v-if="operations.length && !isOperationsLoading">
				<div class="mb-3">
					<span>{{ instrumentSeparatedTrades.instrumentPriceTotal >= 0 ? 'Доход' : 'Убыток' }}</span>
					<span> по инструменту за всё время: {{ instrumentSeparatedTrades.instrumentPriceTotal }} {{ instrument.sign }}</span>
				</div>

				<div class="mb-3">Закрыто позиций за всё время {{ instrumentSeparatedTrades.closedTotal }}, убыточных {{ instrumentSeparatedTrades.lossPositionsCount }}, прибыльных {{ instrumentSeparatedTrades.profitPositionsCount }}</div>

				<el-table
					:data="instrumentSeparatedTrades.positions"
					stripe
				>
					<el-table-column
						prop="tradesCount"
						label="Кол-во сделок"
						width="120px"
					/>

					<el-table-column
						prop="priceTotal"
						label="Итог"
						width="120px"
					/>

					<!-- <el-table-column prop="durationMs" label="durationMs"/> -->
					<el-table-column prop="durationHumanized" label="Удержание позиции"/>
					<el-table-column prop="opened" label="Вход"/>
					<el-table-column prop="closed" label="Закрытие"/>
				</el-table>

				<!-- <div class="d-flex">
					<pre>{{ buySellNotDeclinedSortedOps }}</pre>
					<pre>{{ instrumentTrades }}</pre>
					<pre>{{ instrumentSeparatedTrades.positions }}</pre>
				</div> -->
			</template>
		</el-card>
	</div>
</template>

<script>
import Accounts from 'Components/TinkoffInvest/Accounts'
import FigiSelect from 'Components/TinkoffInvest/FigiSelect'
import { mapState } from 'vuex'
import { dayjs } from 'KitPlugins/dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import {
	fetchOperations,
	getCurrencySymbol,
} from 'Helpers/methods'

dayjs.extend(relativeTime)
dayjs.extend(duration)

export default {
	name: 'Operations',
	components: {
		Accounts,
		FigiSelect,
	},
	data() {
		return {
			filter: {
				from: this.$dayjs('2016-01-01').startOf('day').format(),
				to: this.$dayjs().endOf('day').format(),
				// figi: 'BBG000N9MNX3',
				figi: null,
			},
		}
	},
	computed: {
		...mapState('tinkoffInvest', [
			'brokerAccountId',
		]),
		...mapState({
			isOperationsLoading: state => state.tinkoffInvest.isOperationsLoading,
			operations: state => state.tinkoffInvest.operations,
		}),
		hasRequiredFilters() {
			return this.brokerAccountId && this.filter.figi
		},
		instrument() {
			return {
				currency: this.operations[0].currency,
				sign: getCurrencySymbol(this.operations[0].currency),
			}
		},
		buySellNotDeclinedSortedOps() {
			return this.operations
				.filter(o => ['Buy', 'Sell'].includes(o.operationType))
				.filter(o => o.status !== 'Decline')
				.sort((a, b) => a.id - b.id)
				.map(o => {
					const {
						id,
						isMarginCall,
						instrumentType,
						status,
						date,
						figi,
						...justNeed
					} = o

					return justNeed
				})
		},
		instrumentTrades() {
			if (!this.buySellNotDeclinedSortedOps[0]) return []

			const instrumentTrades = []

			this.buySellNotDeclinedSortedOps.forEach(ops => {
				ops.trades.forEach(trade => {
					const commission = ops.commission ? ((ops.commission.value / ops.quantityExecuted) * trade.quantity) : 0

					instrumentTrades.push({
						date: trade.date,
						quantity: (ops.operationType === 'Buy') ? trade.quantity : -trade.quantity,
						price: trade.price,
						commission,
					})
				})
			})

			return instrumentTrades
		},
		instrumentSeparatedTrades() {
			let instrumentPriceTotal = 0
			const positions = []
			let balance = 0

			this.instrumentTrades.forEach(trade => {
				if (balance === 0) {
					balance += trade.quantity
					positions[positions.length] = {
						opened: trade.date,
						tradesCount: 0,
						priceTotal: 0,
						trades: [trade],
					}
				} else {
					balance += trade.quantity
					positions[positions.length - 1].trades.push(trade)
					if (balance === 0) positions[positions.length - 1].closed = trade.date
				}
			})

			positions.forEach((pos, i) => {
				const priceTotal = -pos.trades.reduce((prev, current) => prev + (current.quantity * current.price) + current.commission, 0)
				positions[i].tradesCount = pos.trades.length
				positions[i].priceTotal = parseFloat(priceTotal.toFixed(2))
				positions[i].durationMs = this.$dayjs(positions[i].closed).diff(positions[i].opened)
				positions[i].durationHumanized = this.$dayjs.duration(positions[i].durationMs).humanize()
				delete positions[i].trades
				instrumentPriceTotal += priceTotal
			})
			// всего открыто позиций
			// сколько прибыльных позиций
			// итоговый результат по цене
			// суммарная цена по убыточным позициям
			// суммарная цена по прибыльным позициям

			const closedTotal = positions.length
			const lossPositionsCount = positions.reduce((prev, current) => ((current.priceTotal < 0) ? prev + 1 : prev), 0)
			const profitPositionsCount = closedTotal - lossPositionsCount

			return {
				positions,
				instrumentPriceTotal: instrumentPriceTotal.toFixed(2),
				closedTotal,
				lossPositionsCount,
				profitPositionsCount,
			}
		},
	},
	watch: {
		brokerAccountId: 'setOperations',
		'filter.figi': 'setOperations',
	},
	created() {
		this.setOperations()
	},
	methods: {
		fetchOperations,
		async setOperations() {
			if (!this.hasRequiredFilters) return

			this.fetchOperations({
				...this.filter,
				brokerAccountId: this.brokerAccountId,
			})
		},
	},
}
</script>