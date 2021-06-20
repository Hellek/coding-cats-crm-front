export const instrumentTypeNames = {
	singular: {
		Stock: 'Акция',
		Currency: 'Валюта',
		Etf: 'ETF',
		Bond: 'Облигация',
	},
	plural: {
		stocks: 'Акции',
		currencies: 'Валюты',
		etfs: 'ETF',
		bonds: 'Облигации',
	},
}

export const operationTypeNames = {
	Buy: 'Покупка',
	Sell: 'Продажа',
	BuyCard: 'BuyCard',
	BrokerCommission: 'Комиссия за сделку',
	ExchangeCommission: 'ExchangeCommission',
	ServiceCommission: 'Комиссия сервиса',
	MarginCommission: 'Комиссия за маржу',
	OtherCommission: 'OtherCommission',
	PayIn: 'Пополнение счёта',
	PayOut: 'Вывод со счёта',
	Tax: 'Tax',
	TaxLucre: 'TaxLucre',
	TaxDividend: 'Налог на дивиденды',
	TaxCoupon: 'Налог на купон',
	TaxBack: 'Возврат налога',
	PartRepayment: 'Частичное погашение',
	Repayment: 'Полное погашение',
	Coupon: 'Купон',
	Dividend: 'Дивиденды',
	SecurityIn: 'SecurityIn',
	SecurityOut: 'SecurityOut',
}