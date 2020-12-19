<template>
	<el-card v-loading="isUserAccountsLoading">
		<div class="d-flex align-items-center">
			<h1 class="flex-shrink mb-0">
				<el-switch
					v-model="isSandbox"
					:active-value="true"
					:inactive-value="false"
					class="mr-4"
				/>

				<span
					:class="isSandbox ? 'color-success' : 'color-danger'"
				>{{ isSandbox ? 'Режим песочницы' : 'Реальный счёт' }}</span>
			</h1>

			<el-divider
				direction="vertical"
				class="mx-5"
			/>

			<el-input
				v-if="!isTokenValid"
				:value="isSandbox ? sandboxToken : realToken"
				clearable
				placeholder="Укажите токен"
				show-password
				class="mr-4"
				style="max-width: 200px;"
				@input="setToken"
			/>

			<el-button
				:loading="isUserAccountsLoading"
				type="primary"
				@click="isTokenValid ? dropToken() : setUserAccounts()"
			>{{ isTokenValid ? 'Выйти' : 'Войти' }}</el-button>
		</div>

		<div v-if="isTokenValid" class="mt-4">
			<el-tabs v-model="tab">
				<el-tab-pane label="Счета" name="accounts">
					<el-tag
						v-for="(acc, i) in userAccounts"
						:key="i"
						size="normal"
						class="mr-4"
					><span class="font-bold">{{ acc.brokerAccountType }}</span> | {{ acc.brokerAccountId }}</el-tag>
				</el-tab-pane>

				<el-tab-pane label="Операции" name="operations">
					<el-form :inline="true">
						<!-- :model="form" ref="form" :rules="rules" label-width="80px"  size="normal" -->
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
							>
								<!-- value-key="" placeholder="" clearable filterable @change="" -->
								<!-- <el-option v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option> -->
							</el-select>
						</el-form-item>

						<el-form-item class="ml-4">
							<el-select
								v-model="operationsFilter.brokerAccountId"
								placeholder="Брокерский счёт"
							>
								<!-- <el-option
									v-for="acc in userAccounts"
									:key="acc.brokerAccountId"
									:label="acc.brokerAccountType"
									:value="acc.brokerAccountId"
								/> -->
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
								<div>Комиссия: {{ props.row.commission ? props.row.commission : '-' }}</div>
								<div>Сделки: {{ props.row.trades ? props.row.trades : '-' }}</div>
							</template>
						</el-table-column>
						<el-table-column label="Тип операции" :formatter="formatOperationType"/>
						<el-table-column label="Дата" prop="date"/>
						<el-table-column label="Инструмент" prop="instrumentType"/>
						<el-table-column label="figi" prop="figi"/>
						<el-table-column label="Лотов в заявке" prop="quantity"/>
						<el-table-column label="Лотов исполнено" prop="quantityExecuted"/>
						<el-table-column label="Цена" prop="price"/>
						<el-table-column label="Платёж" :formatter="formatPayment"/>
						<el-table-column label="Статус" :formatter="formatStatus"/>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>
	</el-card>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
	name: 'TinkoffInvest',
	data() {
		return {
			isSandbox: true,
			isTokenValid: false,
			isUserAccountsLoading: false,
			isOperationsLoading: false,
			tab: 'accounts',
			userAccounts: [],
			operations: [],
			operationsFilter: {
				from: this.$dayjs().startOf('day').format(),
				to: this.$dayjs().endOf('day').format(),
				figi: null,
				brokerAccountId: null,
			},
			api: {},
		}
	},
	computed: {
		...mapState('tinkoffInvest', [
			'sandboxToken',
			'realToken',
		]),
		apiURL() {
			return `https://api-invest.tinkoff.ru/openapi${this.isSandbox ? '/sandbox' : ''}`
		},
		secretToken() {
			return this.isSandbox ? this.sandboxToken : this.realToken
		},
		operationsDateProxy: {
			set(period) {
				[this.operationsFilter.from, this.operationsFilter.to] = period
			},
			get() {
				return [this.operationsFilter.from, this.operationsFilter.to]
			},
		},
	},
	watch: {
		async tab(tab) {
			if (tab === 'operations') this.setOperations()
		},
		isSandbox: {
			immediate: true,
			handler() {
				if (this.secretToken.length < 50) {
					this.isTokenValid = false
					return
				}

				this.setApi()
				if (this.tab === 'accounts') this.setUserAccounts()
				else if (this.tab === 'operations') this.setOperations()
			},
		},
		operationsFilter: {
			deep: true,
			handler: 'setOperations',
		},
	},
	methods: {
		setApi() {
			this.api = axios.create({
				baseURL: this.apiURL,
				withCredentials: false,
				headers: {
					Authorization: `Bearer ${this.secretToken}`,
				},
			})
		},
		async fetchUserAccounts() {
			const { data } = await this.api.get('user/accounts')
			return data.payload.accounts
		},
		async setUserAccounts() {
			try {
				this.isUserAccountsLoading = true
				this.userAccounts = await this.fetchUserAccounts()
				this.isTokenValid = true
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error)
				this.$notifyUserAboutError('Вероятно не валидный токен')
			} finally {
				this.isUserAccountsLoading = false
			}
		},
		async fetchOperations({ from, to, figi = null, brokerAccountId = null }) {
			const { data } = await this.api.get('operations', {
				params: {
					from,
					to,
					figi,
					brokerAccountId,
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
		setToken(token) {
			if (this.isSandbox) this.$store.commit('tinkoffInvest/setSandboxToken', token)
			else this.$store.commit('tinkoffInvest/setRealToken', token)
		},
		dropToken() {
			if (this.isSandbox) this.$store.commit('tinkoffInvest/setSandboxToken', '')
			else this.$store.commit('tinkoffInvest/setRealToken', '')
			this.isTokenValid = false
		},
		formatOperationType(row) {
			switch (row.operationType) {
			case 'Buy': return 'Покупка'
			case 'Sell': return 'Продажа'
			case 'BrokerCommission': return 'Комиссия брокера'
			case 'MarginCommission': return 'Комиссия за маржу'
			default: return row.operationType
			}
		},
		formatPayment(row) {
			let currency = ''

			switch (row.currency) {
			case 'USD': currency = '$'; break
			case 'RUB': currency = '₽'; break
			case 'EUR': currency = '€'; break
			default: currency = ''; break
			}

			return `${row.payment} ${currency}`
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