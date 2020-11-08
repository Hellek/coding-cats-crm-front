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
		// При выходе из компонента отключаемся вручную, нужно и подключиться
		if (this.$socket.disconnected) this.$socket.client.connect()

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

			this.$socket.$unsubscribe('chat/messages/update')
		})

		// Однократно отправляем данные о нас
		this.$socket.client.emit('chat/user/join', this.user)

		// Подписываемя на сообщения
		this.$socket.$subscribe('chat', message => {
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
		this.$socket.client.disconnect()
	},
	methods: {
		send() {
			this.$socket.client.emit('chat', this.messageText)
			this.messageText = ''
		},
	},
}
</script>