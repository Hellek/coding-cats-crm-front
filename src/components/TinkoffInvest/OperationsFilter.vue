<template>
	<el-form :inline="true" class="mb-4">
		<Accounts class="mr-3"/>

		<DatesFromTo class="mr-3"/>

		<FigiSelect
			:value="filter.figi"
			@input="setFilterFigi"
		/>
	</el-form>
</template>

<script>
import Accounts from 'Components/TinkoffInvest/Accounts'
import FigiSelect from 'Components/TinkoffInvest/FigiSelect'
import DatesFromTo from 'Components/TinkoffInvest/DatesFromTo'
import { mapState, mapMutations } from 'vuex'

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
	methods: {
		fetchOperations,
		...mapMutations({
			setFilterFigi: 'tinkoffInvest/setFilterFigi',
		}),
	},
}
</script>