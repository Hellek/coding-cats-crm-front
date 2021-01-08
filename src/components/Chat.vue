<template>
	<div class="d-flex">
		<div
			v-if="$socket.disconnected && !isConnecting"
			class="color-danger font-semi-bold"
		>Не удалось установить соединение, попробуйте позже</div>

		<el-card
			v-else
			v-loading="isConnecting"
			:body-style="{ padding: '12px 20px 20px' }"
			class="w-100p"
		>
			<div>
				<div class="d-inline-block mr-3 mb-3">В чате: </div>

				<el-tag
					v-for="chatUser in chatUsers"
					:key="chatUser.id"
					type="success"
					size="mini"
					effect="dark"
					class="mr-3 mb-3"
				>{{ chatUser.firstName }} {{ chatUser.lastName }}</el-tag>
			</div>

			<el-card
				ref="messagesCard"
				shadow="never"
				:style="{
					'overflow-y': 'scroll',
					height: 'calc(100vh - 160px)',
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
						<span class="mr-1">{{ message.user.firstName }}</span>
						<span class="font-semi-bold font-size-small color-placeholder">{{ message.time }}</span>
					</div>

					<span>{{ message.text }}</span>
				</div>
			</el-card>

			<div class="mt-5">
				<el-input
					ref="message"
					v-model="messageText"
					v-loading="isSending"
					v-disable-composition
					placeholder="Введите текст"
					@keyup.enter.native="send"
				/>
			</div>
		</el-card>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import DisableComposition from 'KitDirectives/DisableComposition'

export default {
	name: 'Chat',
	directives: {
		DisableComposition,
	},
	data() {
		return {
			isConnecting: true,
			isSending: false,
			sendTime: null,
			messageText: '',
			messages: [],
			chatUsers: {},
		}
	},
	computed: {
		...mapState({
			user: state => state.users.user,
		}),
	},
	watch: {
		'$socket.connected': {
			immediate: true,
			handler(connected) {
				if (connected) {
					this.isConnecting = false

					this.$nextTick(() => {
						if (this.$refs.message) this.$refs.message.focus()
					})
				}
			},
		},
	},
	created() {
		// При выходе из компонента отключаемся вручную, нужно и подключиться
		if (this.$socket.disconnected) {
			this.isConnecting = true
			this.$socket.client.connect()
		}

		this.$socket.client.io.on('reconnect_failed', () => {
			this.isConnecting = false
		})

		// Подписываемся на обновление списка участников чата
		this.$socket.$subscribe('chat/users/update', chatUsers => {
			this.chatUsers = chatUsers
		})

		// Однократно получаем список сообщений
		this.$socket.$subscribe('chat/messages/update', messages => {
			this.messages = messages.map(message => ({
				...message,
				time: this.$dayjs(message.time).format('HH:mm'),
			}))

			if (this.$socket.$unsubscribe) this.$socket.$unsubscribe('chat/messages/update')
		})

		// Однократно отправляем данные о нас
		this.$socket.client.emit('chat/user/join', this.user)

		// Подписываемя на сообщения
		this.$socket.$subscribe('chat', message => {
			if (
				message.user.id === this.user.id
				&& this.$dayjs(message.time).isSame(this.$dayjs(this.sendTime))
			) {
				this.messageText = ''
				this.isSending = false
			}

			this.messages.push({
				...message,
				time: this.$dayjs(message.time).format('HH:mm'),
			})

			if (this.$refs.messagesCard) {
				this.$nextTick(() => {
					const el = this.$refs.messagesCard.$el.querySelector('.el-card__body')
					this.$refs.messagesCard.$el.scrollTo(0, el.offsetHeight)
				})
			}
		})
	},
	beforeDestroy() {
		// TODO сейчас не работает
		this.$socket.client.disconnect()
	},
	methods: {
		send() {
			this.isSending = true

			if (!this.messageText.trim()) {
				this.isSending = false
				return
			}

			this.sendTime = new Date()

			this.$socket.client.emit('chat', {
				time: this.sendTime,
				text: this.messageText,
			})
		},
	},
}
</script>