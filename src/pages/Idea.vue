<template>
	<el-card v-loading.fullscreen="isLoading">
		<el-form
			ref="form"
			:model="idea"
			:rules="rules"
			inline
			label-position="top"
		>
			<el-form-item label="Тикер" prop="ticker">
				<el-select
					v-model="idea.ticker"
					:loading="isTickersLoading"
					:remote-method="suggestTickers"
					filterable
					remote
					:disabled="isEditView"
					@change="createOrSave"
				>
					<el-option
						v-for="i in instruments"
						:key="i.ticker"
						:label="i.ticker"
						:value="i.ticker"
					/>
				</el-select>
			</el-form-item>

			<el-form-item
				v-if="isEditView"
				label="Создана"
			>
				<el-input
					:value="toDateTimeFormat(idea.created)"
					disabled
				/>
			</el-form-item>

			<el-form-item
				v-if="isEditView"
				label="Активна"
			>
				<el-input
					:value="idea.active ? 'Да' : 'Нет'"
					disabled
				/>
			</el-form-item>

			<el-card
				v-if="showComments"
			>
				<div
					v-for="(comment, i) in idea.comments"
					:key="i"
					:class="{'mb-2': idea.comments.length > i + 1}"
				>
					<span class="font-size-12 color-placeholder mr-2">{{ toDateTimeFormat(comment.posted) }}</span>
					<span class="font-size-12">{{ comment.text }}</span>
				</div>

				<el-input
					v-if="!isClosed"
					ref="addComment"
					v-model="idea.comment"
					v-disable-composition
					v-loading="isAddingComment"
					placeholder="Добавить комментарий"
					class="w-100p"
					:class="{'mt-4': idea.comments.length}"
					:disabled="isAddingComment"
					@keyup.enter.native="addComment"
				>
					<el-button
						slot="append"
						type="primary"
						size="default"
						icon="el-icon-s-promotion"
						@click="addComment"
					/>
				</el-input>
			</el-card>
		</el-form>

		<div
			v-if="!isClosed"
			class="mt-4"
		>
			<!-- <el-button
				v-if="isCreationView"
				:loading="isSending"
				type="primary"
				@click="createOrSave"
			>{{ isCreationView ? 'Создать' : 'Сохранить' }}</el-button> -->

			<el-button
				v-if="isEditView"
				:loading="isSending"
				@click="closeIdea"
			>Завершить</el-button>

			<el-button
				v-if="isEditView"
				:loading="isSending"
				@click="removeIdea"
			>Удалить</el-button>
		</div>
	</el-card>
</template>

<script>
import { toDateTimeFormat } from 'Utils'
import { isRequired } from 'Utils/validationRules'
import DisableComposition from 'KitDirectives/DisableComposition'

export default {
	name: 'Idea',
	directives: {
		DisableComposition,
	},
	data() {
		return {
			isSending: false,
			isLoading: false,
			isTickersLoading: false,
			isAddingComment: false,
			instruments: [],
			idea: {
				id: null,
				ticker: '',
				created: null,
				active: true,
				comment: '',
				comments: [],
			},
			rules: {
				ticker: [
					isRequired,
				],
			},
		}
	},
	computed: {
		isCreationView() {
			return !this.idea.id
		},
		isEditView() {
			return !this.isCreationView
		},
		isClosed() {
			return !this.idea.active
		},
		showComments() {
			return this.isEditView && (!this.isClosed || (this.isClosed && this.idea.comments.length > 0))
		},
	},
	watch: {
		'$route.params.id': {
			immediate: true,
			handler(newId) {
				if (+newId === this.idea.id) return
				this.idea.id = Number.isNaN(+newId) ? null : +newId
			},
		},
	},
	async created() {
		if (this.isEditView) {
			this.isLoading = true
			await this.getIdea()
			this.isLoading = false
		}
	},
	methods: {
		toDateTimeFormat,
		async getIdea() {
			try {
				this.idea = (await this.$http.get(`ideas/${this.idea.id}`)).data
			} catch (error) {
				this.$notifyUserAboutError(error)
			}
		},
		async createOrSave() {
			if (!this.$isFormValid('form')) return
			this.isSending = true

			try {
				if (this.isCreationView) {
					const { id, ...idea } = (await this.$http.post('ideas', this.idea)).data

					this.idea = { id, ...idea }
					this.$router.replace({ params: { id } })
				} else {
					// await this.$http.put(`/users/${this.userId}`, this.user)
				}

				this.$notify.success({
					title: `Идея ${this.isCreationView ? 'создана' : 'сохранена'}`,
				})
			} catch (error) {
				this.$notifyUserAboutError(error)
			} finally {
				this.isSending = false
			}
		},
		async addComment() {
			if (!this.idea.comment.trim().length) return
			this.isAddingComment = true

			try {
				const comment = (await this.$http.post(`ideas/${this.idea.id}/comment`, this.idea.comment.trim())).data

				this.idea.comments.push(comment)
				this.idea.comment = ''

				this.$nextTick(() => {
					this.$refs.addComment.focus()
				})
			} catch (error) {
				this.$notifyUserAboutError(error)
			} finally {
				this.isAddingComment = false
			}
		},
		async closeIdea() {
			this.isSending = true

			try {
				await this.$http.post(`ideas/${this.idea.id}/close`)
				this.idea.active = false
				this.$notify.success({ title: 'Идея завершена' })
			} catch (error) {
				this.$notifyUserAboutError(error)
			} finally {
				this.isSending = false
			}
		},
		async removeIdea() {
			try {
				await this.$confirm('Данные будут удалены. Вы уверены?', {
					confirmButtonText: 'Да',
					cancelButtonText: 'Нет',
					type: 'warning',
				})

				this.isSending = true

				await this.$http.delete(`ideas/${this.idea.id}`)

				this.$router.push({ name: 'Ideas' })

				this.$notify.success({ title: `Идея по ${this.idea.ticker} удалена` })
			} catch (error) {
				if (error === 'cancel') return
				this.$notifyUserAboutError(error)
			} finally {
				this.isSending = false
			}
		},
		async suggestTickers(queryString) {
			try {
				this.isTickersLoading = true

				this.instruments = (await this.$http.get('instruments', {
					params: { queryString },
				})).data
			} catch (error) {
				this.$notifyUserAboutError(error)
				this.instruments = []
			} finally {
				this.isTickersLoading = false
			}
		},
	},
}
</script>