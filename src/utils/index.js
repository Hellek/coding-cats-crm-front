import { dayjs } from 'KitPlugins/dayjs'

export function toDateFormat(value) {
	return dayjs(value).format('DD.MM.YYYY')
}

export function toDateTimeFormat(value) {
	return dayjs(value).format('DD.MM.YYYY HH:mm:ss')
}

export function getTodaySessionTime() {
	const hour = dayjs().hour()
	const showFinishedSession = hour < 6
	const startOfDay = dayjs().startOf('day')

	return {
		from: startOfDay.add(showFinishedSession ? -1 : 0, 'day').hour(10).format(),
		to: startOfDay.add(showFinishedSession ? 0 : 1, 'day').hour(2).format(),
	}
}

export function getUrlSearchParams() {
	const urlSearchParams = new URLSearchParams(window.location.search)
	return Object.fromEntries(urlSearchParams.entries())
}