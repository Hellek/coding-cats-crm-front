import { dayjs } from 'KitPlugins/dayjs'

export function toDateFormat(value) {
	return dayjs(value).format('DD.MM.YYYY')
}

export function toDateTimeFormat(value) {
	return dayjs(value).format('DD.MM.YYYY HH:mm:ss')
}