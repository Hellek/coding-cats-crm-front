export default [
	{
		name: 'Chat',
		path: '/chat',
		alias: '/',
		component: () => import('Pages/Chat'),
		meta: {
			isNav: true,
			label: 'Чат',
		},
	},
	{
		name: 'TinkoffInvest',
		path: '/tinkoff-invest',
		component: () => import('Pages/TinkoffInvest'),
		meta: {
			isNav: true,
			label: 'TinkoffInvest',
		},
	},
	{
		name: 'RestTest',
		path: '/rest-test',
		component: () => import('Pages/RestTest'),
		meta: {
			isNav: true,
			label: 'RestTest',
			allowedUserId: [1],
		},
	},
	{
		name: 'Roles',
		path: '/roles',
		component: () => import('Pages/Roles'),
		meta: {
			isNav: true,
			label: 'Роли',
			allowedUserId: [1],
		},
	},
	{
		name: 'Role',
		path: '/role/:id?',
		component: () => import('Pages/Role'),
		meta: {
			label: 'Роль',
		},
	},
	{
		name: 'Users',
		path: '/users',
		component: () => import('Pages/Users'),
		meta: {
			isNav: true,
			label: 'Пользователи',
			allowedUserId: [1],
		},
	},
	{
		name: 'User',
		path: '/user/:id?',
		component: () => import('Pages/User'),
		meta: {
			label: 'Пользователь',
		},
	},
	{
		name: 'Settings',
		path: '/settings',
		component: () => import('Pages/Settings'),
		meta: {
			isNav: true,
			label: 'Настройки',
		},
	},
	{
		name: 'The404',
		path: '*',
		component: () => import('KitComponents/PageNotFound'),
		meta: {
			ru: 'Страница не существует',
			tags: [],
		},
	},
]