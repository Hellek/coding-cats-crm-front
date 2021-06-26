<template>
	<el-date-picker
		v-model="operationDatesProxy"
		type="datetimerange"
		:default-time="['10:00:00', '02:00:00']"
		format="dd.MM.yyyy HH:mm:ss"
		range-separator="по"
		:clearable="false"
		:picker-options="pickerOptions"
	/>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getUrlSearchParams, getSessionTime } from 'Utils'

export default {
	name: 'DatesFromTo',
	data() {
		return {
			pickerOptions: {
				shortcuts: [{
					text: 'Сегодня',
					onClick(picker) {
						const { from, to } = getSessionTime()
						picker.$emit('pick', [from, to])
					},
				}, {
					text: 'Вчера',
					onClick(picker) {
						const { from, to } = getSessionTime({ custom: 'yesterday' })
						picker.$emit('pick', [from, to])
					},
				}, {
					text: 'С начала недели',
					onClick(picker) {
						const { from, to } = getSessionTime({ startOf: 'week' })
						picker.$emit('pick', [from, to])
					},
				}, {
					text: 'С начала месяца',
					onClick(picker) {
						const { from, to } = getSessionTime({ startOf: 'month' })
						picker.$emit('pick', [from, to])
					},
				}, {
					text: 'С начала года',
					onClick(picker) {
						const { from, to } = getSessionTime({ startOf: 'year' })
						picker.$emit('pick', [from, to])
					},
				}, {
					text: 'За всё время',
					onClick(picker) {
						const { from, to } = getSessionTime({ custom: 'all' })
						picker.$emit('pick', [from, to])
					},
				}],
			},
		}
	},
	computed: {
		...mapState('tinkoffInvest', [
			'brokerAccountId',
			'filter',
		]),
		operationDatesProxy: {
			set(period) {
				let [from, to] = period
				from = this.$dayjs(from).format()
				to = this.$dayjs(to).format()
				this.setFilterTime({ from, to })
				this.setQuery({ from, to })
			},
			get() {
				return [this.filter.from, this.filter.to]
			},
		},
	},
	created() {
		this.syncUrlAndStore()
	},
	methods: {
		...mapMutations({
			setFilterTime: 'tinkoffInvest/setFilterTime',
		}),
		setQuery({ from, to }) {
			this.$router.replace({
				query: {
					...this.$route.query,
					from,
					to,
				},
			})
		},
		syncUrlAndStore() {
			const query = getUrlSearchParams()
			const defaultTime = getSessionTime()
			const isDefaultTime = defaultTime.from === this.filter.from && defaultTime.to === this.filter.to

			if (query.from && isDefaultTime) {
				this.setFilterTime({ from: query.from, to: query.to })
			} else if (this.filter.from && !query.from) {
				this.setQuery(this.filter)
			}
		},
	},
}
</script>