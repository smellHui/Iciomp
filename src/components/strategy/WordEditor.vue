<template>
  <div>
    <div class="ivu-input" :disabled="disabled" :style="{width: this.autosize.width, height: 'auto', padding: 0}">
      <div class="selectButton">
        <Button type="info" ghost :disabled="disabled" @click.native="selWord(0)">选择主话术模板</Button>&emsp;
        <Button type="info" ghost :disabled="disabled" @click.native="selWord(1)">选择尾部附加营销语</Button>&emsp;
        <Button type="info" ghost :disabled="disabled"><Checkbox v-model="enableVariable">插入变量信息</Checkbox></Button>
      </div>
      <div class="insertVar">
        <Button type="text" size="small" :disabled="!enableVariable" @click.native="insertVar('date')">日期(YYYY-MM-DD)</Button><Divider type="vertical" />
        <Button type="text" size="small" :disabled="!enableVariable" @click.native="insertVar('time')">时间(HH24:MM)</Button>
        <div v-for="(item, index) in variables" :key="index" style="display: inline-block">
          <Divider type="vertical" />
          <Button type="text" size="small" :disabled="!enableVariable" @click.native="insertVar(item.name)">{{item.title}}</Button>
        </div>
      </div>
      <div :contenteditable="!disabled" class="editArea" id="main"
        :style="{minHeight: this.autosize.minRows*3+'em',maxHeight: this.autosize.maxRows*3+'em'}"
        @keyup="keyUp" @click="myClick" v-html="editHtml">
      </div>
      <div :contenteditable="!disabled" class="editArea" id="suffix"
        :style="{minHeight: this.autosize.minRows*2+'em',maxHeight: this.autosize.maxRows*2+'em'}"
        @keyup="keyUp" @click="myClick" v-html="editHtml_1">
      </div>
    </div>
    <Drawer title="选择话术模板" width="60" v-model="isOpen" @on-close="handleClose">
      <Row class="row">
        <i-col span="3" class="label">模板名称</i-col>
        <i-col span="5"><Input type="text" clearable placeholder="请输入话术模板名称" v-model="searchInfo.name"/></i-col>
        <i-col span="3" class="label">适用场景</i-col>
        <i-col span="5">
          <Select v-model="searchInfo.suitableSence" clearable placeholder="请选择话术适用场景">
            <Option v-for="(item,index) in suitableSences" :key="index" :value="item">{{item}}</Option>
          </Select>
        </i-col>
        <i-col span="3" class="label">状态</i-col>
        <i-col span="5">
          <Select v-model="searchInfo.status" clearable placeholder="请选择话术状态">
            <Option value="0">关闭</Option>
            <Option value="1">开启</Option>
          </Select>
        </i-col>
      </Row>
      <Row class="row">
        <i-col span="3" class="label">创建日期</i-col>
        <i-col span="21">
          <DatePicker type="date" placeholder="请选择开始日期" transfer format="yyyy-MM-dd" :value="searchInfo.startDate" @on-change="(val)=>this.searchInfo.startDate=val"/>&emsp;—&emsp;
          <DatePicker type="date" placeholder="请选择结束日期" transfer format="yyyy-MM-dd" :value="searchInfo.endDate" @on-change="(val)=>this.searchInfo.endDate=val"/>
        </i-col>
      </Row>
      <Row class="row">
        <i-col span="24" style="text-align:center">
          <Button icon="ios-search" type="primary" shape="circle" size="small" @click.native="getWordList">搜&emsp;索</Button>&emsp;&emsp;&emsp;&emsp;
          <Button icon="ios-refresh" type="primary" shape="circle" size="small" @click.native="clearSearchInfo">重&emsp;置</Button>
        </i-col>
      </Row>
      <Table :data="wordsData" highlight-row :columns="columns" style="margin: 10px auto" @on-current-change="handleCurrentChange" />
      <Page :total="page.totalRecord"
        :page-size="page.size"
        :current="page.currentNum"
        @on-change="pageChange"
        @on-page-size-change="sizeChange"
        show-sizer show-elevator/>
    </Drawer>
  </div>
</template>
<script>
export default {
  name: 'WordEditor',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    autosize: {
      type: Object,
      default () {
        return {width: '100%', minRows: 4, maxRows: 6}
      }
    },
    value: {
      type: Object,
      default () {
        return {
          mainWordId: '',
          mainWordContent: '',
          suffixWordId: '',
          suffixWordContent: ''
        }
      }
    },
    variables: {
      type: Array,
      default () {
        return [
          {name: 'pn', title: '用户号码', example: '19988888888'}
        ]
      }
    }
  },
  data () {
    return {
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      // 搜索
      searchInfo: {
        wordType: 0,
        name: '',
        status: '',
        suitableSence: '',
        startDate: '',
        endDate: ''
      },
      isOpen: false,
      wordsData: [],
      suitableSences: [],
      columns: [
        {title: '模板名称', key: 'templateName', align: 'center'},
        {title: '内容', key: 'wordContent', align: 'center'},
        {
          title: '类型',
          key: 'templateType',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.templateType ? '尾部营销后缀' : '主话术')
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 60,
          render: (h, params) => {
            return h('div', params.row.status ? '开启' : '关闭')
          }
        }
      ],
      // 话术编辑器
      enableVariable: false,
      lastRange: null,
      editContainer: null,
      editHtml: this.toHTML(this.value.mainWordContent),
      editHtml_1: this.toHTML(this.value.suffixWordContent)
    }
  },
  mounted () {
    this.getSuitableSence()
  },
  methods: {
    toHTML (text) {
      if (!text) {
        text = ''
      }
      let html = '<u contenteditable="false" class="sysVar" name="date" title="当前日期">' + new Date().format('yyyy-MM-dd') + '</u>'
      text = text.replace(/\$\{date\}/g, html)
      html = '<u contenteditable="false" class="sysVar" name="time" title="当前时间">' + new Date().format('hh:mm') + '</u>'
      text = text.replace(/\$\{time\}/g, html)
      for (let v in this.variables) {
        let patt = new RegExp('\\$\\{' + this.variables[v].name + '\\}', 'g')
        html = '<u contenteditable="false" class="sysVar" name="' + this.variables[v].name + '" title="' + this.variables[v].title + '">'
        html += (this.variables[v].example ? this.variables[v].example : this.variables[v].title) + '</u>'
        text = text.replace(patt, html)
      }
      text = text.replace(/\n/g, '<br />')
      return text
    },
    toTEXT (html) {
      html = html.replace(/<u[^<]+?name="date".+?u>/g, '$${date' + '}')
      html = html.replace(/<u[^<]+?name="time".+?u>/g, '$${time' + '}')
      for (let v in this.variables) {
        let patt = new RegExp('<u[^<]+?name="' + this.variables[v].name + '".+?u>', 'g')
        let text = '$${' + this.variables[v].name + '}'
        html = html.replace(patt, text)
      }
      html = html.replace(/<br.*?>/g, '\n')
      html = html.replace(/<.*?>/g, '')
      html = html.replace(/&nbsp;/g, ' ')
      return html
    },
    myClick (event) {
      this.lastRange = window.getSelection().getRangeAt(0)
      this.editContainer = event.target
    },
    keyUp (event) {
      this.lastRange = window.getSelection().getRangeAt(0)
      this.editContainer = event.target
      if (this.editContainer.id === 'main') {
        this.value.mainWordContent = this.toTEXT(this.editContainer.innerHTML)
      } else if (this.editContainer.id === 'suffix') {
        this.value.suffixWordContent = this.toTEXT(this.editContainer.innerHTML)
      }
      this.$emit('input', this.value)
    },
    insertVar (varName) {
      if (this.editContainer && this.lastRange) {
        let text = null
        let title = null
        switch (varName) {
          case 'date':
            title = '当前日期'
            text = new Date().format('yyyy-MM-dd')
            break
          case 'time':
            title = '当前时间'
            text = new Date().format('hh:mm')
            break
          default:
            for (let i = 0, l = this.variables.length; i < l; i++) {
              if (varName === this.variables[i].name) {
                text = this.variables[i].example ? this.variables[i].example : this.variables[i].title
                title = this.variables[i].title
                break
              }
            }
        }
        let uTag = document.createElement('u')
        uTag.setAttribute('contenteditable', false)
        uTag.setAttribute('class', 'sysVar')
        uTag.setAttribute('name', varName)
        uTag.setAttribute('title', title)
        let textNode = document.createTextNode(text)
        uTag.appendChild(textNode)
        let selection = window.getSelection()
        this.editContainer.focus()
        selection.removeAllRanges()
        selection.addRange(this.lastRange)
        let range = selection.getRangeAt(0)
        if (!range.collapsed) {
          if (!range.startContainer.parentNode.isContentEditable &&
            range.startContainer === range.endContainer) {
            return
          }
          document.execCommand('delete')
        }
        range = selection.getRangeAt(0)
        let node = selection.anchorNode
        let parentNode = node.parentNode
        if (node.nodeType === 3) {
          let subtext1 = node.nodeValue.slice(0, range.startOffset)
          let subtext2 = node.nodeValue.slice(range.endOffset)
          if (subtext1.length > 0) {
            parentNode.insertBefore(document.createTextNode(subtext1), node)
          }
          parentNode.insertBefore(uTag, node)
          if (subtext2.length > 0) {
            parentNode.insertBefore(document.createTextNode(subtext2), node)
          }
          parentNode.removeChild(node)
        } else {
          if (node === this.editContainer) {
            node.insertBefore(uTag, node.childNodes[range.startOffset])
          } else {
            parentNode.insertBefore(uTag, node)
          }
        }
        if (this.editContainer.id === 'main') {
          this.value.mainWordContent = this.toTEXT(this.editContainer.innerHTML)
        } else if (this.editContainer.id === 'suffix') {
          this.value.suffixWordContent = this.toTEXT(this.editContainer.innerHTML)
        }
        this.$emit('input', this.value)
        this.lastRange = window.getSelection().getRangeAt(0)
      }
    },
    // 清除搜索信息
    clearSearchInfo () {
      this.searchInfo.name = ''
      this.searchInfo.status = ''
      this.searchInfo.suitableSence = ''
      this.searchInfo.startDate = ''
      this.searchInfo.endDate = ''
    },
    // 页码改变时触发
    pageChange (page) {
      this.page.currentNum = page
      this.getWordList()
    },
    // 每页显示条数改变时触发
    sizeChange (size) {
      this.page.size = size
      this.getWordList()
    },
    // 获取话术列表
    getWordList () {
      this.$httpReq('/common/word/list',
        {page: this.page, search: this.searchInfo},
        'get', (res) => {
          let data = res.data.data.dataList
          for (let i in data) {
            if (data[i].id === this.value.mainWordId || data[i].id === this.value.suffixWordId) {
              data[i]._highlight = true
            }
          }
          this.wordsData = data
          this.page = res.data.data.page
          this.isOpen = true
        })
    },
    // 获取所话术适用场景
    getSuitableSence () {
      this.$httpReq('/common/word/suitableSences', null, 'get', (res) => {
        this.suitableSences = res.data.data
      })
    },
    // 选择话术模板
    selWord (type) {
      this.searchInfo.wordType = type
      this.getWordList()
    },
    handleCurrentChange (curr, old) {
      if (this.searchInfo.wordType === 0) {
        if (this.value.mainWordId !== curr.id) {
          this.value.mainWordId = curr.id
          this.value.mainWordContent = curr.wordContent
        }
      } else if (this.searchInfo.wordType === 1) {
        if (this.value.suffixWordId !== curr.id) {
          this.value.suffixWordId = curr.id
          this.value.suffixWordContent = curr.wordContent
        }
      }
    },
    handleClose () {
      if (this.searchInfo.wordType === 0) {
        this.editHtml = this.toHTML(this.value.mainWordContent)
      } else if (this.searchInfo.wordType === 1) {
        this.editHtml_1 = this.toHTML(this.value.suffixWordContent)
      }
    }
  }
}
</script>
<style scoped>
.selectButton {
  line-height: 50px;
  width: 100%;
  text-align: left;
  padding: 0 20px;
  border-bottom: solid 1px #dddee1
}
.insertVar {
  line-height: 30px;
  width: 100%;
  text-align: left;
  padding: 0 10px;
  border-bottom: solid 1px #dddee1
}
.editArea {
  text-align: left;
  line-height: 1.5em;
  padding: 0 5px;
  overflow: auto;
  border-bottom: solid 1px #dddee1
}
.sysVar {
  color: #666666
}
.row {
  height: 32px;
  line-height: 32px;
  margin: 5px auto;
  text-align: left
}
.label {
  text-align: right;
  padding-right: 10px;
}
</style>
