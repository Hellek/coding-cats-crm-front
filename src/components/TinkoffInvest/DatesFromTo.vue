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
			},
			get() {
				return [this.filter.from, this.filter.to]
			},
		},
	},
	methods: {
		...mapMutations({
			setFilterTime: 'tinkoffInvest/setFilterTime',
		}),
	},
}
</script>