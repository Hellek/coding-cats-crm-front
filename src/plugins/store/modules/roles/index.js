import { http } from 'KitPlugins/http'

function defaultState() {
	return {
		list: {},
	}
}

export default {
	namespaced: true,
	state: defaultState(),
	mutations: {
		setRoles(state, roles) {
			state.list = roles
		},
		setRole(state, role) {
			state.list[role.id] = role
		},
		removeRole(state, id) {
			delete state.list[id]
		},
		dropState(state) {
			Object.assign(state, defaultState())
		},
	},
	actions: {
		dropToDefaults({ commit, dispatch }) {
			dispatch('clearCache')
			commit('dropState')
		},
		clearCache() {
			Object.keys(defaultState()).forEach(key => {
				localStorage.removeItem(`roles/${key}`)
			})
		},
		async fetchRoles({ commit, dispatch }) {
			const storageRolesList = localStorage.getItem('roles/list')

			if (storageRolesList) {
				commit('setRoles', JSON.parse(storageRolesList))
			} else {
				const rolesArray = (await http.get('/roles/list')).data
				const roles = {}

				rolesArray.forEach(role => {
					roles[role.id] = role
				})

				commit('setRoles', roles)
				dispatch('cacheList')
			}
		},
		setRole({ commit, dispatch }, role) {
			commit('setRole', role)
			dispatch('cacheList')
		},
		removeRole({ commit, dispatch }, id) {
			commit('removeRole', id)
			dispatch('cacheList')
		},
		cacheList({ state }) {
			localStorage.setItem('roles/list', JSON.stringify(state.list))
		},
	},
}