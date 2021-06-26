function defaultState() {
	return {
		navs: [],
	}
}

export default {
	namespaced: true,
	state: defaultState(),
	mutations: {
		setNavs(state, navs) {
			state.navs = navs
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
				localStorage.removeItem(`users/${key}`)
			})
		},
		setNavs({ commit, rootState }, { router }) {
			const navs = []

			router.options.routes.forEach(nav => {
				if (!nav.meta || !nav.meta.isNav) return

				if (nav.meta.requireToken && !rootState.users.user.TIRealToken) return

				if (!nav.meta.allowedUserId) {
					navs.push(nav)
					return
				}

				if (nav.meta.allowedUserId.includes(rootState.users.user.id)) navs.push(nav)
			})

			commit('setNavs', navs)
		},
	},
}