<template>
  <div style="margin: 0px 0px 15px 0px">
    <Row type="flex" justify="space-between" class="header">
      <Col :span=12>
      <div>
        <span>Language</span>
        <Select :value="language" @on-change="onLangChange" class="adjust">
          <Option v-for="item in languages" :key="item" :value="item">{{item}}
          </Option>
        </Select>
        <Tooltip content="ResetCode" placement="top" style="margin-left: 10px">
          <i-button @click="onResetClick" :disabled="loader1"><i class="el-icon-refresh-left"></i></i-button>
        </Tooltip>
      </div>
      </Col>
      <Col :span=12>
      <div class="fl-right">
        <span>Theme:</span>
        <Select :value="theme" @on-change="onThemeChange" class="adjust">
          <Option v-for="item in themes" :key="item.label" :value="item.value">{{item.label}}
          </Option>
        </Select>
      </div>
      </Col>
    </Row>
    <codemirror :value="value" :options="options" @change="onEditorCodeChange" ref="myEditor"></codemirror>
    <i-button style="float: right; margin-top: 16px;" @click.native="doAnalyze" :disabled="doing">Analyze</i-button>
    <div class="tomas">
      <Poptip placement="top" style="margin-left: 10px;">
        <div slot="content" style="white-space: normal;">
          <p class="t-stl">1. Support notes</p>
          <p class="t-stl">2. Support multiple statement execution</p>
          <p class="t-stl">3. <span style="color: red; font-weight: 900;">Attention</span></p>
          <p class="t-stl"> The ';' separator must be used when executing multiple statements</p>
        </div>
        <i class="el-icon-warning-outline"></i>
      </Poptip>
    </div>
  </div>
</template>
<script>
  import { codemirror } from 'vue-codemirror-lite'

  // theme
  import 'codemirror/theme/monokai.css'
  import 'codemirror/theme/solarized.css'
  import 'codemirror/theme/material.css'

  // mode
  import 'codemirror/mode/sql/sql'
  import 'codemirror/mode/javascript/javascript'

  import 'codemirror/addon/hint/show-hint.css'
  import 'codemirror/addon/hint/show-hint.js'
  import 'codemirror/addon/hint/sql-hint.js'
  // active-line.js
  import 'codemirror/addon/selection/active-line.js'

  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/indent-fold.js'

  export default {
    name: 'CodeMirrors',
    components: {
      codemirror
    },
    props: {
      value: {
        type: String,
        default: 'select * from mysql'
      },
      languages: {
        type: Array,
        default: () => {
          return ['SQL', 'JavaScript']
        }
      },
      language: {
        type: String,
        default: 'SQL'
      },
      theme: {
        type: String,
        default: 'solarized'
      },
      doAnalyze: {
        type: Function
      },
      doing: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
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
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          lineWrapping: true,
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        },
        mode: {
          'SQL': 'text/x-mysql',
          'JavaScript': 'text/javascript'
        },
        themes: [
          {label: 'Monokai', value: 'monokai'},
          {label: 'Solarized_Light', value: 'solarized'},
          {label: 'Material', value: 'material'}
        ],
        loader1: false,
        timerReset: null,
        timerAnalyze: null,
        loader2: false,
      }
    },
    mounted () {
      this.editor.setOption('mode', 'text/x-mysql')
      // this.editor.focus()
    },
    methods: {
      onEditorCodeChange (newCode) {
        this.$emit('update:value', newCode)
      },
      onLangChange (newVal) {
        this.editor.setOption('mode', this.mode[newVal])
        this.$emit('changeLang', newVal)
      },
      onThemeChange (newTheme) {
        this.editor.setOption('theme', newTheme)
        this.$emit('changeTheme', newTheme)
      },
      onResetClick () {
        if (!this.timerReset) {
          this.$emit('resetCode')
          this.$notify({
            title: 'Success',
            message: 'Code initialized successfully',
            type: 'success'
          });
          this.loader1 = true
          this.timerReset = setTimeout(() => {
            this.loader1 = false
            this.timerReset = null
          }, 3000)
        }
      }
    },
    computed: {
      editor () {
        // get current editor object
        return this.$refs.myEditor.editor
      }
    },
    watch: {
      'theme' (newVal, oldVal) {
        this.editor.setOption('theme', newVal)
      }
    }
  }
</script>

<style lang="less" scoped>
  p {
    margin: 0;
  }
  span {
    color: #222;
  } 
  .header {
    margin: 5px 5px 15px 5px;
    .adjust {
      width: 150px;
      margin-left: 10px;
    }
    .fl-right {
      float: right;
    }
  }
</style>

<style scoped>
  .t-stl {
    color: black;
    font-weight: 600;
  }
  .tomas {
      float: right; 
      margin: -1px 3px 0 0; 
      cursor: pointer;  
      font-size: 18px; 
      color: #73c9e5
    }
  .CodeMirror {
    height: auto !important;
  }
  .CodeMirror-scroll {
    min-height: 300px;
    max-height: 1000px;
  }
</style>
