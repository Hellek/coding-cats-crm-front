export const isNumber = {
	message: 'Укажите число',
	type: 'number',
}

export const isRequired = {
	message: 'Обязательное поле',
	trigger: 'change',
	required: true,
}

export const isEmail = {
	message: 'Некорректный емейл',
	trigger: 'change',
	type: 'email',
}

export function isLatin(caseType = 'any') {
	return {
		trigger: 'change',
		validator: (rule, value, callback) => {
			let regex = ''

			switch (caseType) {
			case 'any': default: regex = /^[a-zA-Z]+$/; break
			case 'lower': regex = /^[a-z]+$/; break
			case 'upper': regex = /^[A-Z]+$/; break
			}

			if (regex.test(value)) {
				callback()
				return
			}

			let msg = 'Только латинские символы'

			switch (caseType) {
			case 'lower': msg += ' в нижнем регистре'; break
			case 'upper': msg += ' в верхнем регистре'; break
			default:
			}

			callback(new Error(msg))
		},
	}
}

export function minLength(num) {
	return {
		message: `Не менее ${num} символов`,
		trigger: 'change',
		min: num,
	}
}

export function minNumber(num) {
	return {
		trigger: 'change',
		validator: (rule, value, callback) => {
			if (value < num) return callback(`Не может быть меньше ${num}`)
			return callback()
		},
	}
}