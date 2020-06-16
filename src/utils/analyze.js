import { MESSAGE, SQLTYPE } from './constants'
import  Parser from './codeAnalyze'
class main {
	constructor (SQL) {
		this.SQL = SQL
		this.isAvailable = true
		this.init(SQL)	
	}
	init (SQL) {
		if (!SQL) {
			this.isAvailable = false
			return 
		}
		SQL = SQL.trim()
		if (!SQL) {
			this.isAvailable = false
			return 
		}
		this.SQL = SQL.toLowerCase()
	}
	excuteSQLType () {
		if (!(this.SQL && this.isAvailable)) {
			return this.message(MESSAGE.MES_NOCONTENT)
		}
		let firstOrderReg = /([a-z]+)\s+/, firstOrder = this.SQL.match(firstOrderReg)
		if (!firstOrder && !firstOrder[1]) {
			return this.message(MESSAGE.MES_NOCONTENT)
		}  
		firstOrder = firstOrder[1]
		let types = Object.values(SQLTYPE)
		if (types.some(res => res.toLowerCase() === firstOrder)) {
			firstOrder = `__${ firstOrder }`
			return {
				result: Parser[firstOrder].call(this, this.SQL),
				sql: this.SQL
			}
		} else {
			return this.message(MESSAGE.MES_NOREQU)
		}
	}
	message (message, type = MESSAGE.TYPE.ERROR, option = null) {
		let Mes = {}
		Mes.message = message
		Mes.date = Date()
		Mes.option = option
		if (type === MESSAGE.TYPE.ERROR) {
			Mes.status = MESSAGE.STATUS.ERROR
		} else if (type === MESSAGE.TYPE.SUCCESS) {
			Mes.status = MESSAGE.STATUS.SUCCESS
		}
		return Mes
	} 
}

export default main