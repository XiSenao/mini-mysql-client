<template>
	<div class="code-me" id="cvideo">
		<div id="showme">
			<Card :padding="20" id="submit-code" dis-hover>
				<CodeMirrors :value.sync="code"
					:language="language"
					:codeTemplate="codeTemplate"
					@resetCode="onResetToTemplate"
					@changeTheme="onChangeTheme"
					:doAnalyze="analyzeCode"
					:doing="!!flag"
					@changeLang="onChangeLang"></CodeMirrors>
			</Card>
			<el-drawer
				:visible.sync="drawer"
				:direction="direction"
				close-on-press-escape
				:show-close="false"
				:before-close="handleClose">
				<h1 style="text-align: center; margin-bottom: 16px; color: #222;">Mysql History</h1>
				<el-table
				:data="tableData"
				style="width: 100%">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item>
								<strong>Code</strong>
								<codemirror :value="props.row.code" :options="options" ref="myEditor"></codemirror>
							</el-form-item>
							<el-form-item>
								<strong>Result</strong>
								<div style="color: #36ed5e; font-weight: 600;">{{ props.row.result }}</div>
							</el-form-item>
							<el-form-item>
								<strong>Show Detail</strong>
								<el-table
									:data="showData[props.$index]"
									border
									style="width: 100%">
									<template v-for="(params, index) in title[props.$index]">
										<el-table-column
											:fixed="index === 1 ? true : false"
											:prop="params"
											:label="params">
										</el-table-column>
									</template>
								</el-table>
							</el-form-item>
						</el-form>
					</template>
					</el-table-column>
						<el-table-column
							label="Time"
							width="160"
							prop="time">
						</el-table-column>
						<el-table-column
							label="User"
							prop="name">
						</el-table-column>
						<el-table-column
							label="Type"
							prop="option">
						</el-table-column>
						<el-table-column label="Option" width="220">
							<template slot-scope="scope">
								<el-button
									size="mini"
									@click="handleFlag(scope.$index, scope.row)">{{ scope.row.flag? 'unFlag' : 'Flag' }}</el-button>
								<el-button
									size="mini"
									type="danger"
									@click="handleDelete(scope.$index, scope.row)">Delete</el-button>
							</template>
						</el-table-column>
					</el-table>
			</el-drawer>
			<div id="social-icons">
				<div class="text-right">
					<ul class="social-icons">
						<li>
							<el-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start">
								<div slot="content" style="white-space: normal;">
									<!-- <p class="t-stl">1. Support notes</p> -->
									<p>You can view or simply<br/>  operate the current or<br/> previous execution <span style="color: red; font-weight: 600;">history</span><br/> in a period of time</p>
								</div>
								<a @click="drawer = !drawer">
									<i class="fa fa-header"></i>
								</a>
							</el-tooltip>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<Introduce v-if="false"/>
	</div>
</template>

<script>
	// import top from './top.vue'
	import CodeMirrors from './../components/CodeMirrors.vue'
	import { codemirror } from 'vue-codemirror-lite'
	import { codeTips } from './../utils/constants'
	// mode
	import 'codemirror/mode/sql/sql'
	import 'codemirror/mode/javascript/javascript'
	import 'codemirror/addon/selection/active-line'
	import { mapGetters, mapMutations, mapState } from 'vuex'
	import analyze from './../utils/analyze'
	import { SQLTYPE } from './../utils/constants'
	import api from "./../api/api"
	import { formatDate } from './../utils/utils'
	export default {	
		components: {
			CodeMirrors,
			codemirror
		},
		computed: {
			...mapState(['userName', 'mysqlInfo'])
		},
		mounted () {
			this.code = this.codeTips
			this.init()
		},
		data () {
			return {
				title: [],
				showData: [],
				search: '',
				options: {
					// codemirror options
					tabSize: 4,
					mode: 'text/x-mysql',
					extraKeys: {"Ctrl": "autocomplete"},
					theme: 'solarized',
					lineNumbers: true,
					line: true,
					// 代码折叠
					foldGutter: true,
					readOnly: true,
					Autofocus: false,
					styleActiveLine: true,
					gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
					// 选中文本自动高亮，及高亮方式
					styleSelectedText: true,
					lineWrapping: true,
					highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
				},
				tableData: [],
				language: 'SQL',
				codeTemplate: '',
				code: '',
				codeTips: codeTips,
				theme: 'solarized',
				drawer: false,
				direction: 'rtl',
				flag: 0
			}	
		},
		methods: {
			...mapMutations(['resetMysql', 'cacheMysql', 'addFlag']),
			init () {
				this.tableData = []
				this.showData = []
				for (let j = 0; j < this.mysqlInfo.length; ++j) {
					let param = this.mysqlInfo[j]
					this.tableData.push({
						time: param.time,
						name: param.user,
						option: param.type,
						code: param.code,
						result: param.result,
						flag: param.flag || false
					})
					this.title[j] = param.showDetail.title
					this.title[j] = this.title[j].map(res => res.replace(/\./g, '$'))
					let value = param.showDetail.value
					for (let nowParam of value) {
						let obj = {}, length = this.title[j].length
						for (let i = 0; i < length; ++i) {
							obj[this.title[j][i]] = nowParam[i]
						}
						if (!this.showData[j]) {
							this.showData[j] = []
						}
						this.showData[j].push(obj)
					}
				}
			},
			analyzeCode () {
				let code = this.code ? this.code.trim() : ''
				if (code[code.length - 1] === ';') {
					code = code.slice(0, code.length - 1)
				}
				let codes = code.split(';'), executeQueue = []
				for (let currentCode of codes) {
					let mainAnalyze = new analyze(currentCode)
					let result = mainAnalyze.excuteSQLType()
					executeQueue.push(result)
				}
				let length = executeQueue.length, queueTasks = []
				this.flag = length
				for (let i = 0; i < length; ++i) {
					let now = executeQueue[i].result
					if (now.status !== 200) {
						this.$notify.error({
							title: 'Error',
							message: `
								${now.message}
								Time: ${now.date}
							`	
						});
						this.flag--
					} else {
						queueTasks.push(this.getStatusByServer(now.message, now.option, executeQueue[i].sql))
					}
				}
				this.requestMySql(queueTasks)
			},
			getStatusByServer (data, methods, currentCode) {
				let fn = null, sendData = ''
				if (methods === SQLTYPE.USE) {
					fn = 'usedatabase'
					sendData = data.database
				} else if (methods === SQLTYPE.SHOW_DATABASES) {
					fn = 'showDatabase'
				} else if (methods === SQLTYPE.SHOW_TABLES) {
					fn = 'showTable'
				} else if (methods === SQLTYPE.CREATE_DATABASE) {
					fn = 'createDatabase'
					sendData = data.database
				} else if (methods === SQLTYPE.CREATE_TABLE) {
					fn = 'createTables'
					data.method = "create_table"
					sendData = data
				} else if (methods === SQLTYPE.INSERT) {
					fn = 'insert'
					data.method = "insert_into"
					sendData = data
				} else if (methods === SQLTYPE.GRANT) {
					fn = 'grant'
					let newData = data.res
					newData.users = newData.users.users
					delete newData.options
					sendData = newData
				} else if (methods === SQLTYPE.DROP_DATABASE) {
					fn = 'dropDatabase'
					sendData = data.database
				} else if (methods === SQLTYPE.DROP_TABLE) {
					fn = 'dropTable'
					sendData = data.table
				} else if (methods === SQLTYPE.SELECT) {
					fn = 'select'
					let table = [], formula = {}, resultColumns = []
					for (let column of data.result.selectTablesArray) {
						table.push({
							tablename: column.table,
							alias: column.tableAlias
						})
					}
					table = JSON.stringify(table)
					for (let column of data.result.selectColumnsArray) {
						if (column.column === 'ALL') {
							resultColumns = "[*]"
							break
						}
						resultColumns.push({
							table: column.column,
							alias: column.tableAlias
						})
					}
					if (resultColumns === "[*]") {
						resultColumns = "[*]"
					} else {
						let push = []
						for (let column of resultColumns) {
							push.push({
								selectColumn: column.table,
								alias: column.alias
							})
						}
						resultColumns = JSON.stringify(push)
					}
					let obj = {}
					obj.arrRes = []
					if (Array.isArray(data.result.RESSET.arrRes)) {
						for (let column of data.result.RESSET.arrRes) {
							obj.arrRes.push({
								key: column.KEY,
								value: column.VALUE,
								operator: column.OP,
								uid: column.UID
							})	
						}
						obj.pointStr = data.result.RESSET.pointStr	
						formula = JSON.stringify(obj)
					} else {
						formula = ""
					}
					sendData = {
						resultColumns,
						table,
						formula
					}
				} else if (methods === SQLTYPE.DELETE) {
					fn = 'delete'
					let deleteTable = data.header, table = [], formula = {}
					let obj = {}
					obj.arrRes = []
					for (let column of data.resset.arrRes) {
						obj.arrRes.push({
							key: column.KEY,
							value: column.VALUE,
							operator: column.OP,
							uid: column.UID
						})	
					}
					obj.pointStr = data.resset.pointStr	
					formula = obj
					for (let itable of data.table) {
						let reg = /\s*(.+)\s+as\s+(.+)\s*/
						let match = itable.match(reg)
						table.push({
							tablename: match ? reg[1] : itable.trim(),
							alias: reg[2] ? reg[2] : null
						})
					}
					deleteTable = JSON.stringify(deleteTable)
					table = JSON.stringify(table)
					formula = JSON.stringify(formula)
					sendData = {
						deleteTable,
						table,
						formula
					}
				} else if (methods === SQLTYPE.UPDATE) {
					fn = 'update'
					let updateItem = [], table = [], formula = {}
					for (let itable of data.table) {
						table.push({
							tablename: itable.table,
							alias: itable.alias
						})
					}
					for (let num of data.OPVALUE) {
						updateItem.push({
							key: num.key,
							value: +num.value ? +num.value : num.value
						})
					}
					let obj = {}
					obj.arrRes = []
					for (let column of data.RESSET.arrRes) {
						obj.arrRes.push({
							key: column.KEY,
							value: column.VALUE,
							operator: column.OP,
							uid: column.UID
						})	  
					}
					obj.pointStr = data.RESSET.pointStr	
					formula = obj
					formula = JSON.stringify(formula)
					updateItem = JSON.stringify(updateItem)
					table = JSON.stringify(table)
					sendData = { 
						formual: formula,
						updateItem,
						table
					}
				}
				return fn ? { fn, sendData, currentCode } : null
			},
			requestMySql (queueTasks) {
				let now = queueTasks.shift()
				if (now === null) {
					this.requestMySql(queueTasks)
				}
				if (!now) {
					return
				}
				let { fn, sendData, currentCode } = now
				api[fn](sendData).then(res => {
					let availableOption = ['showDatabase', 'showTable']
					let optionMap = {
						'showDatabase': 'AllDatabase',
						'showTable': 'AllTable'
					}
					if (res.data.status !== "200") {
						this.$notify.error({
							title: `${ fn }   ${ res.data.status }`,
							message: 	res.data.info
						});
					} else {
						this.$notify({
							title: 'Success',
							message: availableOption.includes(fn) ? `Result: ${ res.data.data[optionMap[fn]].toString() }` : res.data.info || 'Execution successful',
							type: 'success'
						});
						let revokeData = {
							time: formatDate(res.headers.date),
							user: this.userName || '--',
							type: fn,
							code: currentCode.trim(),
							result: availableOption.includes(fn) ? res.data.data[optionMap[fn]].toString() : res.data.info || '--',
							showDetail: {
								'title': res.data.data.tables ? res.data.data.tables.columns : [],
								'value': res.data.data.tables ? res.data.data.tables.values : []
							}
						}
						this.cacheMysql(revokeData)
						this.init()
					}
					this.flag--
					this.requestMySql(queueTasks)
				}).catch(res => {
					this.flag--
					this.requestMySql(queueTasks)
				})
			},
			onResetToTemplate () {
				this.code = this.codeTips
			},
			onChangeTheme (theme) {
				this.theme = theme
			},
			onChangeLang (language) {
				this.language = language
			},
			handleClose(done) {
				this.drawer = false
				done();
			},
			handleFlag (index, obj) {
				this.addFlag(obj)
				this.init()
			},
			handleDelete (index, obj) {
				let nowValue = this.mysqlInfo.filter(res => !(res.time === obj.time && res.user === obj.name))
				this.resetMysql(nowValue)
				this.init()
			}
		}	
	}
</script>

<style>
	.v-modal {
		z-index: 0 !important;
	}
	body {
		text-align: left;
	}
</style>
<style scoped>
	#showme {
		position: relative;
		height: 100%;
		z-index: 99;
	}
	body {
		text-align: left !important;
	}
	.code-me {
		display: flex;
		justify-content: center;
	}
	#submit-code {
		width: 800px;
		height: 460px;
		margin-top: 160px;
		position: relative;
	}
	.hs-s {
		position: absolute;
		right: -50px;
		top: 17px;
		transform: rotate(90deg);
	}
	.vue-codemirror-wrap /deep/.CodeMirror {
		min-width: 400px !important;
		min-height: 160px !important;
	}
	.el-drawer__wrapper /deep/ .el-drawer__container /deep/ .el-drawer{
 		overflow: scroll !important;
	}
	.el-drawer__wrapper /deep/ .el-drawer {
		width: 37% !important;
	}
	#cvideo:after {
    content: '';
    opacity: 0.75;
    background: #4096ee;
    background: linear-gradient(to bottom, #4096ee 0%,#39ced6 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4096ee', endColorstr='#39ced6',GradientType=0 );
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
	}
	.code-me /deep/ .el-form--inline .el-form-item {
		display: block;
	}
	.code-me /deep/ .el-form--inline .el-form-item__content {
		display: block;
	}
</style>