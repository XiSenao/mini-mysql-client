const availableOption = ['select', 'update', 'delete', 'insert', 'drop']
export function dealOptions (str) {
	let s = '', flag = false, arr = [], res = [], option = '', pik = false
	str = str.trim()
	for (let i = 0; i < str.length; ++i) {
		let now = str[i]
		if (now === '(') {
			if (!flag) {
				flag = true
				option = s
				s = ''
			} else {
				return false
			}
		} else if (now === ')') {
			flag = false
			if (!pik) {
				arr.push(s)
				res.push({
					option: option,
					columns: arr
				})
				option = ''
				arr = []
				pik = true
			}
			s = ''
		} else if (now === ',') {
			if (!option) {
				option = s
			} else {
				arr.push(s)
			}
			if (!pik && !flag) {
				res.push({
					option: option,
					columns: arr
				})
				option = ''
				arr = []
			}
			if (pik) {
				pik = false
			}
			s = ''
		} else if (now !== ' ') {
			s += now
		}
	}
	if (!!s) {
		res.push({
			option: s,
			columns: []
		})
	}
	return res
}

export function dealUsers (str) {
	let users = [], canGrant = false, s = ''
	for (let i = 0; i < str.length; ++i) {
		let nowValue = str[i]
		if (nowValue === ',') {
			users.push(s.trim())
			s = ''
		} else if (nowValue === ' ' && s) {
			if (s !== 'with') {
				users.push(s.trim())
				s = ''
			} else {
				let currentValue = str.substring(i - 4)
				s = ''
				if (/\s*with\s+grant\s+option\s*/.test(currentValue)) {
					canGrant = true
					break
				}
			}
		} else if (nowValue !== ' ') {
			s += nowValue
		}
	}
	if (s) {
		users.push(s.trim())
	}
	return {
		users,
		canGrant
	}
}

export function dealTables (str) {
	let length = str.length, database = '', s = '', flag = false, tables = [], res = []
	for (let i = 0; i < length; ++i) {
		let nowValue = str[i]
		if (nowValue === '.') {
			database = s
			s = ''
		} else if (nowValue === '(') {
			flag = true
		} else if (nowValue === ')') {
			flag = false
		} else if (nowValue === ',') {
			tables.push(s)
			s = ''
			if (!flag) {
				res.push({
					database,
					tables
				})
				database = ''
				tables = []
			}
		}else if (nowValue !== ' ') {
			s += nowValue
		}
	}
	if (!!s) {
		tables.push(s)
		res.push({
			database,
			tables
		}) 
	}
	return res
}

export function checkLegal (obj) {
	let eOption = obj.options, reg = /^[a-z][a-z_1-9]*/
	for (let option of eOption) {
		if (!availableOption.includes(option.option)) {
			return false
		}
		if (option.columns.some(res => !reg.test(res))) {
			return false
		}
	}
	let eTables = obj.tables
	for (let op of eTables) {
		if (!reg.test(op.database)) {
			return false
		}
		if (op.tables.some(res => res !== '*' && !reg.test(res))) {
			return false
		}
	}
	let eUsers = obj.users.users
	if (eUsers.some(res => !reg.test(res))) {
		return false
	}
	return true
}
        
function checkLimit (str) {
    let res = null
    switch (str) {
        case 'not null':
            res = 'not null'
            break
        case 'unique':
            res = 'unique'
            break
        case 'primary key':
            res = 'primary key'
            break
        case 'default':
            res = 'default'
            break
        default:
            res = null
    }
    return res
}

function analyzeStatement (sql) {
    try {
        let go = sql
        let reg = /\s+/
        let rep = /\((\s*\d+\s*)\)/g
        let current = reg.exec(go)
        let key = go.substring(0, current.index).trim()
        go = go.substring(current.index + current[0].length)
        let limitInfo = go.match(rep), limitNum = null, limitStyle = null
        if (limitInfo && limitInfo.length > 1) {
            return false
        } else if (limitInfo && limitInfo.length === 1) {
            limitNum = parseInt(go.substring(go.search(limitInfo[0]), go.search(limitInfo[0]) + limitInfo[0].length - 2).trim())
            limitStyle = go.substring(0, go.search(limitInfo[0]) - 1).trim()
            go = go.substring(go.search(limitInfo[0]) + limitInfo[0].length - 1).trim()
        } else {
            limitNum = 0
            limitStyle = reg.exec(go) ? go.substring(0, reg.exec(go).index).trim() : go
            go = reg.exec(go) ? go.substring(reg.exec(go).index + reg.exec(go)[0].length).trim() : ""
        }
        var flag = true, arrLimit = []
        if (!!go) {
            go = go.split(reg)
            for (let i = 0; i < go.length; ++i) {
                if (checkLimit(go[i])) {
                    if (go[i] === 'default') {
                        if (i + 1 < go.length) {
                            arrLimit.push(go[i] + ' ' + go[i + 1])
                            i += 1
                        } else {
                            return false
                        }
                    } else {
                        arrLimit.push(checkLimit(go[i]))
                    }
                    flag = true
                } else if (i + 1 < go.length && checkLimit(go[i] + ' ' + go[i + 1])) { 
                    arrLimit.push(checkLimit(go[i] + ' ' + go[i + 1]))
                    i += 1
                    flag = true
                } else {
                    flag = false
                    break
                }
            } 
        } 
        arrLimit = arrLimit.toString()
        if (flag) {
            return {
                key,
                limitStyle, 
                limitNum,
                arrLimit
            }
        }
    } catch (e) {
        return false
    }
} 

export function createTable (sql) {
    try {
        var reg = /\(/
        var currentIndex = reg.exec(sql).index 
        var table = sql.substring(0, currentIndex).trim() 
        if (/\s+/g.test(table)) {
            return false
        }
        var index = /\)/.exec(sql.split('').reverse().join('')).index
        var newStr = sql.substring(currentIndex + 1, sql.length - index - 1).trim()
        var arr = newStr.split(','), arrReg = []
        for (let i = 0; i < arr.length; ++i) { // 不能使用 Object.keys(arr).forEach(res => ...) 
            let nowValue = arr[i].trim()
            let nowGo = analyzeStatement(nowValue)
            if (nowGo) {
                arrReg.push(nowGo)
            } else {
                return false
            }
        }
        return {
            table,
            rowParameter: arrReg
        }
    } catch (e) {
        return false
    }
}

export function createDatabase (sql) {
    try {
        let reg = /\s+/
        let arr = sql.split(reg)
        if (arr.length > 1) {
            return false
        }
        let table = arr[0]
        if (/\s+/g.test(table)) {
            return false
        }
        return {
            database: table
        }
    } catch (e) {
        return false
    }
}

function priorityValue (str) {
    if (str === '+') {
        return 1
    } else if (str === '*') {
        return 2
    } else if (str === ')') {
        return 3
    } else if (str === '(') {
        return 4
    } else {
        return 0
    }
}

export function reversePolishNotation (sqlSet) {
    let middleValues = [], charactValues = [], sql = sqlSet.pointStr, checkSql = sqlSet.availableUID
    for (let i = 0; i < sql.length; ++i) {
        if (sql[i] >= '0' && sql[i] <= '9') {
            let value = sql.substring(i, i + 32)
            if (checkSql.indexOf(value) === -1) {
                return false
            }
            middleValues.push(value)
            i += 31
            continue
        }
        if (priorityValue(sql[i])) {
            if (sql[i] === ')') {
                let top = charactValues.length
                while (top > 0 && charactValues[top - 1] != '(') {
                    middleValues.push(charactValues[top - 1]) 
                    charactValues.pop()
                    top--
                }
                if (top <= 0 || charactValues[top - 1] != '(') {
                    return false
                } else {
                    charactValues.pop()
                }
            } else {
                let top = charactValues.length, value = priorityValue(sql[i])
                while (top > 0 && priorityValue(charactValues[top - 1]) > value && charactValues[top - 1] != '(') {
                    middleValues.push(charactValues[top - 1])
                    charactValues.pop()
                    top--
                }
                charactValues.push(sql[i])
            }
        }
    }
    while (charactValues.length) {
        middleValues.push(charactValues[charactValues.length - 1])
        charactValues.pop()
    }
    let pointStr = middleValues.map(res => {
        if (res === '*') {
            return 'and'
        } else if (res === '+') {
            return 'or'
        }
        return res
    })
    return {
        pointStr,
        arrRes: sqlSet.arrRes
    }
}

export function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
    if(regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

function clean (arr, sql) {
    let current = [ ...arr ]
    for (let j = 0; j < arr.length; ++j) {
        let num = arr[j].trim()
        let equal = num.split('=')
        if (equal.length > 2) {
            // 多表
            let str = ' ', queue = []
            for (let i = 0; i < equal.length - 1; ++i) {
                let now = equal[i]
                str += now + ' = ' + equal[i + 1]
                queue.push(now + ' = ' + equal[i + 1])
                if (i < equal.length - 2) {
                    str += 'and'
                } else {
                    str += ' '
                }
            }
            current.splice(j, 1, ...queue)
            sql = sql.replace(num, str)		
        } 
    }
    return {
        current,
        sql
    }
}

export function convertExpression (sql) {
    sql = sql.replace(/\"/g, '\'').toLowerCase().trim()
    let reg = /(\s*['"]?[a-z][a-z_1-9]*(\.[a-z][a-z_1-9]*|[a-z_1-9]*)['"]?\s*(=\s*['"]?[a-z][a-z_1-9]*(\.[a-z][a-z_1-9]*|[a-z_1-9]*)['"]?\s*)+|\s*['"]?[a-z][a-z_1-9]*(\.[a-z][a-z_1-9]*|[a-z_1-9]*)['"]?\s*(=|>|<)\s*['"]?([a-z][a-z_1-9]*(\.[a-z][a-z_1-9]*|[a-z_1-9]*)|\d+(\.\d+|\d*))['"]?\s*)/g
    let opReg = /(.+)(=|>|<)(.+)/
    let current = sql.match(reg), arrRes = [], availableUID = []
    let SQLObj = clean(current, sql)
    let cSql = SQLObj.sql
    current = SQLObj.current
    for (let i = 0; i < current.length; ++i) {
        let now = current[i].replace(/\s+/g, '') 
        let nowValue = opReg.exec(now)
        let resObj = {
            UID: getUUID(),
            OP: nowValue[2]
        }
        resObj.KEY = isNumber(nowValue[1]) ? +nowValue[1] : nowValue[1]
        resObj.VALUE = isNumber(nowValue[3]) ? +nowValue[3] : nowValue[3]
        arrRes.push(resObj)
        cSql = cSql.replace(current[i], arrRes[arrRes.length - 1].UID)
        availableUID.push(arrRes[arrRes.length - 1].UID)
    }
    cSql = cSql.replace(/\s+/g, '').replace(/and/g, '*').replace(/or/g, '+')
    return {
        pointStr: cSql,
        arrRes,
        availableUID
    }
 }

function getUUID () {
     // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
     return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(10);
    }).substring(0, 32);
 }
 
function formatTen(num) {
    return num > 9 ? (num + "") : ("0" + num);
}
  
export function formatDate(date) {
	date = new Date(date)
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	return year + "-" + formatTen(month) + "-" + formatTen(day) + ' ' + formatTen(hour) + ':' + formatTen(minute) + ':' + formatTen(second);
}
  