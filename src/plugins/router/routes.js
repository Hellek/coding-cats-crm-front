export default [
	{
		name: 'Ideas',
		path: '/ideas',
		component: () => import('Pages/Ideas'),
		meta: {
			isNav: true,
			requireToken: true,
			label: 'Идеи',
		},
	},
	{
		name: 'Idea',
		path: '/idea/:id?',
		component: () => import('Pages/Idea'),
		meta: {
			requireToken: true,
			label: 'Идея',
		},
	},
	{
		name: 'Operations',
		path: '/operations',
		component: () => import('Pages/Operations'),
		meta: {
			isNav: true,
			requireToken: true,
			label: 'Операции',
		},
	},
	{
		name: 'Trades',
		path: '/trades',
		alias: '/',
		component: () => import('Pages/Trades'),
		meta: {
			isNav: true,
			requireToken: true,
			label: 'Сделки (бета)',
		},
	},
	{
		name: 'Portfolio',
		path: '/portfolio',
		component: () => import('Pages/Portfolio'),
		meta: {
			isNav: true,
			requireToken: true,
			label: 'Портфель',
		},
	},
	{
		name: 'Instruments',
		path: '/instruments',
		component: () => import('Pages/Instruments'),
		meta: {
			isNav: true,
			requireToken: true,
			label: 'Инструменты',
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