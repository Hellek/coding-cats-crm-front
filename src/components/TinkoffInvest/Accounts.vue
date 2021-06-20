<template>
	<el-select
		v-loading="isAccountsLoading"
		:value="brokerAccountId"
		placeholder="Счёт"
		@change="$store.commit('tinkoffInvest/setBrokerAccountId', $event)"
	>
		<el-option
			v-for="acc in accounts"
			:key="acc.brokerAccountId"
			:label="acc.label"
			:value="acc.brokerAccountId"
		/>
	</el-select>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Accounts',
	computed: {
		...mapState('tinkoffInvest', [
			'brokerAccountId',
			'isAccountsLoading',
			'accounts',
		]),
	},
}
</script>