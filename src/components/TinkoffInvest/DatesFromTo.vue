<template>
	<el-date-picker
		v-model="operationDatesProxy"
		type="datetimerange"
		:default-time="['10:00:00', '02:00:00']"
		format="dd.MM.yyyy HH:mm:ss"
		range-separator="по"
		:clearable="false"
	/>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getUrlSearchParams, getTodaySessionTime } from 'Utils'

export default {
	name: 'DatesFromTo',
	computed: {
		...mapState('tinkoffInvest', [
			'brokerAccountId',
			'filter',
		]),
		operationDatesProxy: {
			set(period) {
				const [from, to] = period
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
					from: this.$dayjs(from).format(),
					to: this.$dayjs(to).format(),
				},
			})
		},
		syncUrlAndStore() {
			const query = getUrlSearchParams()
			const defaultTime = getTodaySessionTime()
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