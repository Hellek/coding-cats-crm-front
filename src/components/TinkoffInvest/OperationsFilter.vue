<template>
	<el-form :inline="true" class="mb-4">
		<Accounts class="mr-3"/>

		<DatesFromTo class="mr-3"/>

		<FigiSelect
			:value="filter.figi"
			:used="used"
			@input="setFilterFigiWrapper"
		/>
	</el-form>
</template>

<script>
import Accounts from 'Components/TinkoffInvest/Accounts'
import FigiSelect from 'Components/TinkoffInvest/FigiSelect'
import DatesFromTo from 'Components/TinkoffInvest/DatesFromTo'
import { mapState, mapMutations } from 'vuex'
import { getUrlSearchParams } from 'Utils'

import {
	fetchOperations,
} from 'Helpers/methods'

export default {
	name: 'OperationsFilter',
	components: {
		Accounts,
		FigiSelect,
		DatesFromTo,
	},
	props: {
		used: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		...mapState('tinkoffInvest', [
			'brokerAccountId',
			'filter',
		]),
	},
	watch: {
		brokerAccountId: 'fetchOperations',
		filter: {
			immediate: true,
			deep: true,
			handler: 'fetchOperations',
		},
	},
	created() {
		this.syncUrlAndStore()
	},
	methods: {
		fetchOperations,
		...mapMutations({
			setFilterFigi: 'tinkoffInvest/setFilterFigi',
		}),
		setFilterFigiWrapper(figi) {
			this.setFilterFigi(figi)
			this.$router.replace({ query: { ...this.$route.query, figi } })
		},
		syncUrlAndStore() {
			const query = getUrlSearchParams()

			if (query.figi && !this.filter.figi) {
				this.setFilterFigi(query.figi)
			} else if (this.filter.figi && !query.figi) {
				this.$router.replace({ query: { ...this.$route.query, figi: this.filter.figi } })
			}
		},
	},
}
</script>