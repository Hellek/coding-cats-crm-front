const KitVueConfigs = require('./node_modules/element-ui-kit/vue.configs')

module.exports = {
	...KitVueConfigs.vueConfig,
	configureWebpack: {
		...KitVueConfigs.vueConfig.configureWebpack,
		resolve: {
			alias: {
				'element-ui/lib/locale/lang/zh-CN': 'element-ui/lib/locale/lang/ru-RU',
				ScssVariables: '@/assets/styles/variables.scss',
				...KitVueConfigs.getAliases({
					dirname: __dirname,
				}),
			},
		},
	},
	pwa: {
		name: 'StockBox',
		themeColor: '#222933',
		msTileColor: '#222933',
		appleMobileWebAppCapable: 'yes',
		manifestOptions: {
			icons: [
				{ src: './pwa/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
				{ src: './pwa/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
				{ src: './pwa/android-chrome-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
				{ src: './pwa/android-chrome-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
				{ src: './pwa/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
				{ src: './pwa/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
				{ src: './pwa/favicon.ico' },
			],
		},
		workboxPluginMode: 'GenerateSW',
		workboxOptions: {
			navigateFallback: 'index.html',
		},
	},
}