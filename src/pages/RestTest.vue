<template>
	<div class="d-flex">
		<div class="flex-1 mr-4">
			<template v-for="(section, i) in api">
				<el-collapse
					v-if="isDevelopment || section.title !== 'Development'"
					:key="i"
					v-model="section.activeNames"
				>
					<el-collapse-item
						:title="section.title"
						:name="section.title"
					>
						<div
							v-for="(req, z) in section.requests"
							:key="z"
							class="d-flex mb-4"
						>
							<div class="flex-grow">
								<div class="d-flex">
									<el-button
										plain
										:type="getButtonMethodType(req.method)"
										style="width: 100px;"
										@click="send(req)"
									>{{ req.method }}</el-button>

									<el-input
										v-model="req.query"
										class="ml-3"
									/>
								</div>

								<div
									v-if="req.body"
									class="mt-3"
								>
									<el-input
										:value="JSON.stringify(req.body)"
										type="textarea"
										rows="3"
										@input="req.body = JSON.parse($event)"
									/>
								</div>

								<el-divider v-if="req.divider" class="mb-2"/>
							</div>
						</div>
					</el-collapse-item>
				</el-collapse>
			</template>
		</div>

		<el-card
			v-loading="isSending"
			class="flex-1"
		>
			<div
				v-if="result.status"
				class="font-semi-bold d-inline-block px-4 py-2 border-radius-base"
				:class="result.status === 200 ? 'bg-color-success color-white' : 'bg-color-danger color-black'"
			>{{ result.status }} {{ result.statusText }}</div>
			<pre>{{ result.data }}</pre>
		</el-card>
	</div>
</template>

<script>
import { mapState } from 'vuex'

const getDefaultResult = () => ({
	data: null,
	status: null,
})

export default {
	name: 'RestTest',
	data() {
		return {
			isSending: false,
			result: getDefaultResult(),
			api: [
				{
					title: 'Auth',
					requests: [
						{
							method: 'POST',
							query: '/auth/authenticate',
							body: {
								email: 'aaa@ya.ru',
								password: '123',
							},
						},
						{
							method: 'POST',
							query: '/auth/logout',
						},
						{
							method: 'POST',
							query: '/auth/password/reset',
							body: {
								email: 'aaa@ya.ru',
							},
						},
						{
							method: 'PUT',
							query: '/auth/password',
							body: {
								email: 'aaa@ya.ru',
								password: '123',
								hash: '$2a$05$shw2v5WHOVD8VZHLMhu33OHDa5XIRLXeyyTKVgJDlT1R9g6f0nXZG',
							},
						},
					],
				},
				{
					title: 'Users',
					requests: [
						{
							method: 'POST',
							query: '/users',
							body: {
								email: 'aaa@ya.ru',
								firstName: 'Roman',
								lastName: 'Basharin',
								password: '123',
								phone: '79992222222',
								active: true,
							},
						},
						{
							method: 'PUT',
							query: '/users/2',
							body: {
								email: 'sasha@ya.ru',
								firstName: 'Sasha',
								lastName: 'Basharina',
								password: '321',
								phone: '79993333344',
								active: true,
							},
						},
						{
							method: 'GET',
							query: '/users',
						},
						{
							method: 'GET',
							query: '/users/2',
						},
						{
							method: 'DELETE',
							query: '/users/2',
						},
					],
				},
				{
					title: 'Development',
					requests: [
						{
							method: 'POST',
							query: 'development/table/instruments',
						},
						{
							method: 'DELETE',
							query: 'development/table/instruments',
							divider: true,
						},
						{
							method: 'POST',
							query: 'development/table/ideas',
						},
						{
							method: 'DELETE',
							query: 'development/table/ideas',
							divider: true,
						},
						{
							method: 'POST',
							query: 'development/table/users',
						},
						{
							method: 'DELETE',
							query: 'development/table/users',
							divider: true,
						},
						{
							method: 'POST',
							query: 'development/table/roles',
						},
						{
							method: 'PUT',
							query: 'development/table/roles',
						},
						{
							method: 'DELETE',
							query: 'development/table/roles',
						},
					],
				},
			],
		}
	},
	computed: {
		...mapState({
			currentUser: state => state.users.user,
		}),
		isDevelopment() {
			return process.env.VUE_APP_MODE === 'development'
		},
	},
	methods: {
		async send({ query, method = 'GET', body }) {
			if (this.currentUser.id !== 1 && method !== 'GET') {
				this.$notify.warning({ title: 'Вам доступны только GET запросы' })
				return
			}

			this.isSending = true
			this.result = getDefaultResult()

			try {
				let secondParam = null

				if (typeof body !== 'undefined' && (method === 'POST' || method === 'PUT')) {
					secondParam = body
				}

				this.result = await this.$http[method.toLowerCase()](query, secondParam)
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error)

				if (error.response) {
					this.result = error.response
					return
				}

				this.result.data = error
				this.result.status = 'XXX'
			} finally {
				this.isSending = false
			}
		},
		getButtonMethodType(method) {
			switch (method) {
			case 'DELETE': return 'danger'
			case 'GET': return 'info'
			default: return 'success'
			}
		},
	},
}
</script>