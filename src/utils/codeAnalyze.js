import { MESSAGE, SQLTYPE } from './constants'
import { 
	convertExpression, 
	reversePolishNotation, 
	createDatabase, 
	createTable, checkLegal, dealTables, dealUsers, dealOptions } from './utils'

/**
 * @param { create } 
 */
function __create (sql) {
    try {
        var regTable = /create\s+table\s+/g
        var regDatabase = /create\s+database\s+/g
        var tableInfo = sql.match(regTable) 
		var databaseInfo = sql.match(regDatabase) 
		let result = null, option = null
        if (tableInfo) {
			result = createTable(sql.substring(tableInfo[0].length).trim())
			option = SQLTYPE.CREATE_TABLE
        } else if (databaseInfo) {
			result = createDatabase(sql.substring(databaseInfo[0].length).trim()) 
			option = SQLTYPE.CREATE_DATABASE
		}
		if (result) {
			return this.message(result, MESSAGE.TYPE.SUCCESS, option)
		} else {
			return this.message(MESSAGE.MES_ERRORPARSE)
		}
    } catch (e) {
    	return this.message(MESSAGE.MES_ERRORPARSE)
    } 
}

/**
 * @param { use } 
 */
function __use (sql) {
	let reg = sql.match(/use\s+(.+)\s*/)
	return reg[1] ? this.message({ database: reg[1] }, MESSAGE.TYPE.SUCCESS, SQLTYPE.USE) :
	this.message(MESSAGE.MES_ERRORPARSE)
}

/**
 * @param { drop table or drop database } 
 */
function __drop (sql) {
	let regDropDataBase = sql.match(/\s*drop\s+database\s+(.+)\s*/)
	let regDropTable = sql.match(/\s*drop\s+table\s+(.+)\s*/)
	let option = null, result = null
	if (!!regDropDataBase) {
		let database = regDropDataBase[1]
		result = { database }
		option = SQLTYPE.DROP_DATABASE
	} else if (!!regDropTable) {
		let table = regDropTable[1]
		result = { table }
		option = SQLTYPE.DROP_TABLE
	}
	if (result) {
		return this.message(result, MESSAGE.TYPE.SUCCESS, option)
	} else {
		return this.message(MESSAGE.MES_ERRORPARSE)
	}
}

/**
 * @param { delete from } 
 */
function __delete (sql) {

    try {
		let reg = sql.match(/delete(.+)from\s+(.+)\s+where\s+(.+)/)
		let regl = sql.match(/delete(.+)from\s+(.+)/), table = [], reChange = null, header = []
        if (!(reg || regl)) {
			return this.message(MESSAGE.MES_NOCONTENT)
		}
		if (!reg) {
			let currentValue = regl[1].trim()
			if (currentValue) {
				header = currentValue.split(',').map(res => res.trim())
			}
			table = regl[2].trim().split(',').map(res => res.trim())
			reChange = null
		} else {
			let currentValue = reg[1].trim()
			if (currentValue) {
				header = currentValue.split(',').map(res => res.trim())
			}
			table = reg[2].trim().split(',').map(res => res.trim())
			reChange = reversePolishNotation(convertExpression(reg[3].trim()))
			if (!reChange) {
				return this.message(MESSAGE.MES_ERRORJUAGESTATE)
			}
		}
		return this.message({ header, table, resset: reChange }, MESSAGE.TYPE.SUCCESS, SQLTYPE.DELETE)
    } catch (_) {
        return this.message(MESSAGE.MES_ERRORPARSE)
    } 
}

/**
 * @param { grant ... on ... to  } 
 */
function __grant (sql) {
	let regOption = sql.match(/grant\s+(.+)\s+on\s+(.+)\s+to\s+(.+)/), res = {}
	try {
		for (let i = 1; i < regOption.length; ++i) {
			let nowValue = regOption[i].trim()
			if (i === 1) {
				res.options = dealOptions(nowValue)
			} else if (i === 2) {
				res.tables = dealTables(nowValue)
			} else {
				res.users = dealUsers(nowValue)
			}
		}
		if (checkLegal(res)) {
			for (let i = 0; i < res.tables.length; ++i) {
				let now = res.tables[i]
				now.table = now.tables
				delete now.tables
			}
			return this.message({ res }, MESSAGE.TYPE.SUCCESS, SQLTYPE.GRANT)
		} else {
			return this.message(MESSAGE.MES_ILLEGAL)
		}
	} catch (_) {
		return this.message(MESSAGE.MES_ERRORPARSE)
	}
}

/**
 * @param { insert into value(s) } 
 */
function __insert (sql) {
	try {
		var reg = /insert\s+into\s+/g
		// console.log(reg.exec(he)) // 不能使用 reg.exec(he)
		var beginValue = sql
		var begin = reg.exec(beginValue)
		var newStr = beginValue.substring(begin[0].length)
		reg = /\((.+?)\)/g
		let arr = []
		for (let i = 0; i < newStr.match(reg).length; i++) {
			let now = newStr.match(reg)[i]
			arr[i] = {
				begin: newStr.search(now) - 1,
				end: newStr.search(now) + now.length - 1,
				 length: now.length,
				 base: newStr,
				value: newStr.substring(newStr.search(now) - 1, newStr.search(now) + now.length - 1)
			}
		}
		var getValueReg = /(value)s?(\b|\()/
		var getValueIndex = getValueReg.exec(newStr).index
		var limitNumber = 0, limitBody = []
		Object.keys(arr).forEach(res => {
			let now = arr[res]
			if (now.begin < getValueIndex) {
				limitNumber++
				limitBody = now.value.substring(1, now.value.length - 1).trim().replace(/(\s+|"|')/g, '').split(',')
			}
		})
		if (limitNumber > 1) {
			return this.message(MESSAGE.MES_ILLEGAL)
		}
		var table = ''
		if (limitNumber === 1) {
			let initIndex = arr[0].begin
			table = newStr.substring(0, initIndex)
			arr = arr.slice(1)
		} else {
			let initIndex = getValueIndex
			table = newStr.substring(0, initIndex)
		}
		table = table.trim()
		if (/\s+/.test(table)) {
			return this.message(MESSAGE.MES_ILLEGAL)
		}
		let values = []
		for (let i = 0; i < arr.length; ++i) {
			let currentValue = arr[i].value
			let newArr = currentValue.substring(1, currentValue.length - 1).trim().replace(/(\s+)/g, '').split(',')
			newArr = newArr.map(res => {
				let now = res.substring(1, res.length - 1)
				if (!now) {
					return +res
				} else {
					return now
				}
			})
			values.push(newArr)
		}
		return this.message({ table, limitBody, values }, MESSAGE.TYPE.SUCCESS, SQLTYPE.INSERT)
	} catch (e) {
		console.log(e)
		return this.message(MESSAGE.MES_ERRORPARSE)
	}
}

/**
 * @param { select ... from ... (where)  } 
 */
function __select (sql) {
	try {
		let currentSql = sql
		let reg = currentSql.match(/\s*select\s+(.+)\s+from/)
		let selectColumns = reg[1], selectColumnsArray = []
		if (selectColumns.trim() === '*') {
			selectColumnsArray.push({
				tableAlias: null,
				column: 'ALL'
			})
		} else {
			selectColumns = selectColumns.split(',')
			for (let column of selectColumns) {
				column = column.trim()
				let splitValue = column.split('.')
				if (splitValue.length > 2) {
					return this.message(MESSAGE.MES_ERRORSELECTCOLUMN)
				}
				selectColumnsArray.push({
					tableAlias: splitValue[1] ? splitValue[0].trim() : null,
					column: splitValue[1] ? splitValue[1].trim() : splitValue[0].trim() 
				})
			}
		}
		currentSql = currentSql.slice(reg[0].length).trim()
		let selectTables = []
		let isWhere = false
		if (/\s+where\s+/.test(currentSql)) {
			isWhere = true
			reg = currentSql.match(/(.+)\s+where/)
			selectTables = reg[1].split(',')
		} else {
			reg = currentSql
			selectTables = currentSql.split(',')
		}
		let selectTablesArray = []
		for (let table of selectTables) {
			table = table.trim()
			let splitValue = table.split('as')
			if (splitValue.length > 2) {
				return this.message(MESSAGE.MES_ERRORSELECTTABLE)
			}
			selectTablesArray.push({
				tableAlias: splitValue[1] ? splitValue[1].trim() : null,
				table: splitValue[0].trim() 
			})
		}
		currentSql = currentSql.slice(reg[0].length).trim()
		let result = {
			selectColumnsArray,
			selectTablesArray
		}
		if (isWhere) {
			result.RESSET = reversePolishNotation(convertExpression(currentSql))
		} else {
			result.RESSET = ''
		}
		return this.message({ result }, MESSAGE.TYPE.SUCCESS, SQLTYPE.SELECT)
	} catch (_) {
		return this.message(MESSAGE.MES_ERRORPARSE)
	}
}

/**
 * @param { show } 
 */
function __show (sql) {
	let regDatabases = /show\s+databases/.test(sql)
	let regTables = /show\s+tables/.test(sql)
	if (!regDatabases && !regTables) {
		return this.message(MESSAGE.MES_ERRORPARSE)
	} 
	let option = null
	if (regDatabases) {
		option = SQLTYPE.SHOW_DATABASES
	} else {
		option = SQLTYPE.SHOW_TABLES
	}
	return this.message(null, MESSAGE.TYPE.SUCCESS, option)
}

/**
 * @param { update } 
 */
function __update (sql) {
	let reg = /^update\s*.+\s*set/
	let current = reg.exec(sql)
	if (!current) {
		return this.message(MESSAGE.MES_ILLEGAL)
	}
	let table = sql.substring(6, current[0].length - 3).trim(), newTable = []
	let ctable = table.split(',')
	for (let i = 0; i < ctable.length; ++i) {
		let now = ctable[i].trim()
		let reg = /\s+as\s+/
		let index = now.search(reg)
		if (index !== -1) {
			newTable.push({
				table: now.substring(0, index).replace(/\s+/, ''),
				alias: now.substring(index + 3).replace(/\s+/, '')
			})
		} else {
			newTable.push({
				table: now.replace(/\s+/, ''),
				alias: null
			})
		}
	}
	sql = sql.substring(current[0].length)
	reg = /\s+where\s+/g
	let sWhere = sql.match(reg)
	if (!sWhere) {
		return this.message(MESSAGE.MES_ILLEGAL)
	} 
	let currentIndex = sql.search(sWhere[sWhere.length - 1])
	current = sql.substring(0, currentIndex).trim()
	let arr = current.split(','), arrRes = []
	for (let i = 0; i < arr.length; ++i) {
		let currentValue = arr[i].trim().replace(/\s+/g, '').replace(/('|")/g, '')
		let index = currentValue.search('=')
		let key = currentValue.substring(0, index)
		let value = currentValue.substring(index + 1)
		arrRes.push({
			key,
			value
		})
	}
	sql = sql.substring(currentIndex + sWhere[sWhere.length - 1].length - 2).trim()
	let RESSET = reversePolishNotation(convertExpression(sql))
	return this.message({ OPVALUE: arrRes, table: newTable, RESSET }, MESSAGE.TYPE.SUCCESS, SQLTYPE.UPDATE)
}

export default {
	__update,
	__show,
	__select,
	__insert,
	__grant,
	__delete,
	__drop,
	__create,
	__use
}

