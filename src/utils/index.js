import { dayjs } from 'KitPlugins/dayjs'

export const brokerEstablishDate = dayjs('2016-01-01').toISOString()

export function toDateFormat(value) {
	return dayjs(value).format('DD.MM.YYYY')
}

export function toDateTimeFormat(value) {
	return dayjs(value).format('DD.MM.YYYY HH:mm:ss')
}

// eslint-disable-next-line consistent-return
export function getSessionTime({ startOf = 'day', custom = null } = { startOf: 'day' }) {
	const hour = dayjs().hour()
	const showFinishedSession = hour < 7
	const startOfDay = dayjs().startOf('day')
	const startOfTodaySession = startOfDay.add(showFinishedSession ? -1 : 0, 'day').hour(7)
	const endOfTodaySession = startOfDay.add(showFinishedSession ? 0 : 1, 'day').hour(2)

	if (custom === 'yesterday') {
		return {
			from: startOfTodaySession.subtract(1, 'day').format(),
			to: endOfTodaySession.subtract(1, 'day').format(),
		}
	}

	if (custom === 'all') {
		return {
			from: brokerEstablishDate.format(),
			to: endOfTodaySession.format(),
		}
	}

	if (['day', 'week', 'month', 'year'].includes(startOf)) {
		const start = dayjs().startOf(startOf)

		return {
			from: start.add(showFinishedSession ? -1 : 0, 'day').hour(7).format(),
			to: endOfTodaySession.format(),
		}
	}
}

export function getUrlSearchParams() {
	const urlSearchParams = new URLSearchParams(window.location.search)
	return Object.fromEntries(urlSearchParams.entries())
}