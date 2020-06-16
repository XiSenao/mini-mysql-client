import axios from 'axios'
axios.defaults.baseURL = '/'
export default {
	// 阿腾
	login (username, password) {
		let formData = new FormData()
		formData.set('username', username)
		formData.set('pwd', password)
		return ajax('Login', 'post', {
			data: formData
		})
	},
	usedatabase (database) {
		let formData = new FormData()
		formData.set('database', database)
		return ajax('Use/Database', 'post', {
			data: formData
		})
	},
	showTable () {
		return ajax('Show/Table', 'get')
	},
	showDatabase (database) {
		let formData = new FormData()
		formData.set('database', database)
		return ajax('Show/Database', 'get', {
			data: database
		})
	},
	createDatabase (databasename) {
		let formData = new FormData()
		formData.set('databasename', databasename)
		return ajax('Create/Databases', 'post', {
			data: formData
		})
	},
	createTables (json) {
		return ajax('Create/Tables', 'post', {
			data: json
		})
	},
	insert (json) {
		return ajax('Insert_into/Table', 'post', {
			data: json
		})
	},
	grant (json) {
		return ajax('Grant/Authority', 'post', {
			data: json
		})
	},
	logout () {
		return ajax('logout', 'post')
	},
	dropDatabase (Databasename) {
		let formData = new FormData()
		formData.set('Databasename', Databasename)
		return ajax('Drop/Database', 'post', {
			data: formData
		})
	},
	dropTable (Tablename) {
		let formData = new FormData()
		formData.set('Tablename', Tablename)
		return ajax('Drop/Table', 'post', {
			data: formData
		})
	},
	// 阿肥
	select (data) {
		let { table, formula, resultColumns } = data
		let formData = new FormData()
		formData.set('table', table)
		formData.set('formula', formula)
		formData.set('resultColumns', resultColumns)
		return ajax('select/table', 'post', {
			data: formData
		})
	},
	delete (data) {
		let { deleteTable, table, formula } = data
		let formData = new FormData()
		formData.set('deleteTable', deleteTable)
		formData.set('table', table)
		formData.set('formula', formula)
		return ajax('delete/table', 'post', {
			data: formData
		})
	},
	update (data) {
		let { updateItem, table, formual } = data
		let formData = new FormData()
		formData.set('updateItem', updateItem)
		formData.set('table', table)
		formData.set('formual', formual)
		return ajax('update/table', 'post', {
			data: formData
		})
	}
	
}

function ajax (url, method, options) {
	if (options !== undefined) {
		var {params = {}, data = {}, headers = {}, responseType = {}} = options
	} else {
		params = data = headers = responseType = {}
	} 
	return new Promise((resolve, reject) => {
		axios({
			url,
      method,
      params,
      data,
      headers,
      responseType
		}).then(res => {
			if (res.status !== 200) {
				reject(res)
			}
			resolve(res)
		}).catch (_ => {
			reject(_)
		})
	})
}