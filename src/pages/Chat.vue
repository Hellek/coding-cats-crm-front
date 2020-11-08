<template>
	<div class="d-flex">
		<div
			v-if="$socket.disconnected"
			class="color-danger font-semi-bold"
		>Подключение отсутствует</div>

		<el-card
			v-else
			:body-style="{ padding: '12px 20px 20px' }"
			class="w-100p"
		>
			<div>
				<span class="mr-1">В чате: </span>

				<el-tag
					v-for="chatUser in chatUsers"
					:key="chatUser.id"
					type="success"
					size="mini"
					effect="dark"
					class="mr-3 mb-3"
				>{{ chatUser.firstname }}</el-tag>


			</div>
			<el-card
				ref="messagesCard"
				shadow="never"
				:style="{
					'overflow-y': 'scroll',
					height: 'calc(100vh - 200px)',
				}"
			>
				<div
					v-for="(message, i) in messages"
					:key="i"
					:class="{'mt-4': i > 0}"
				>
					<div
						class="font-bold mb-2"
					>
						<span class="mr-1">{{ message.user.firstname }}</span>
						<span class="font-semi-bold font-size-small color-placeholder">{{ message.time }}</span>
					</div>

					<span>{{ message.text }}</span>
				</div>
			</el-card>

			<div class="mt-5">
				<el-input
					ref="message"
					v-model="messageText"
					placeholder="Введите текст"
					@keyup.enter.native="send"
				/>
			</div>
		</el-card>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Chat',
	data() {
		return {
			messageText: '',
			messages: [],
			chatUsers: {},
		}
	},
	watch: {
		'$socket.connected': {
			immediate: true,
			handler(connected) {
				if (connected) {
					this.$nextTick(() => {
						this.$refs.message.focus()
					})
				}
			},
		},
	},
	computed: {
		...mapState({
			user: state => state.users.user,
		}),
	},
	created() {
		this.$socket.client.emit('chat/user-credentials', this.user)

		this.$socket.$subscribe('chat', data => {
			this.messages.push({
				...data,
				time: this.$dayjs(data.time).format('HH:mm'),
			})

			if (this.$refs.messagesCard) {
				this.$nextTick(() => {
					const el = this.$refs.messagesCard.$el.querySelector('.el-card__body')
					this.$refs.messagesCard.$el.scrollTo(0, el.offsetHeight)
				})
			}
		})

		this.$socket.$subscribe('chat/user/connect', user => {
			this.$notify.success({
				title: `${user.firstname} присоединяется к чату`,
			})
		})

		this.$socket.$subscribe('chat/user/disconnect', user => {
			this.$notify.success({
				title: `${user.firstname} покидает чат`,
			})
		})
	},
	methods: {
		send() {
			this.$socket.client.emit('chat', this.messageText)
			this.messageText = ''
		},
	},
}
</script>