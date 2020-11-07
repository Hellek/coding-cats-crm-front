<template>
	<div class="d-flex">
		<div
			v-if="$socket.disconnected"
			class="color-danger font-semi-bold"
		>Подключение отсутствует</div>

		<el-card
			v-else
			class="w-100p"
		>
			<el-card
				shadow="never"
			>
				<div
					v-for="(message, i) in chat.messages"
					:key="i"
					:class="{'mt-4': i > 0}"
				>
					<div
						class="font-bold mb-2"
					>
						<span class="mr-1">{{ message.user }}</span>
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
			chat: {
				messages: [
					{ user: 'Роман', text: 'Привет ❤️, пойдём сегодня в кино?', time: '11:45' },
					{ user: 'Александра', text: 'Да, с удовольствием)', time: '11:45' },
					{ user: 'Роман', text: 'Заеду за тобой в 17:00)', time: '11:46' },
					{ user: 'Александра', text: 'Буду ждать с нетерпением 🐱', time: '11:47' },
				],
			},
		}
	},
	computed: {
		...mapState({
			user: state => state.users.user,
		}),
	},
	mounted() {
		this.$refs.message.focus()
	},
	methods: {
		send() {
			this.chat.messages.push({
				user: this.user.firstname,
				text: this.messageText,
				time: this.$dayjs().format('HH:mm'),
			})

			this.messageText = ''
		},
	},
}
</script>