<template>
  <div class="ivu-input" :disabled="disabled" :style="{width: this.autosize.width, height: 'auto', padding: 0}">
    <div class="toolBar">
      <Dropdown placement="bottom-start" @on-click="insertVar">
        <Button type="text" :disabled="disabled" size="small" style="box-shadow:none">插入&emsp;<Icon type="arrow-down-b"></Icon></Button>
        <DropdownMenu slot="list">
          <DropdownItem :disabled="disabled" v-for="item in menus" :key="item.name" :name="item.name">{{item.title}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ButtonGroup size="small" style="margin-left:10px;margin-top:-3px;">
        <Button :disabled="disabled" icon="ios-remove" title="减小显示字号" style="box-shadow:none" @click.native="subFont"/>
        <Button :disabled="disabled" icon="ios-add" title="增大显示字号" style="box-shadow:none" @click.native="addFont"/>
        <Button :disabled="disabled" icon="ios-calendar-outline" title="插入系统日期" style="box-shadow:none" @click.native="insertVar('SYSDATE')"/>
        <Button :disabled="disabled" icon="ios-time-outline" title="插入系统时间" style="box-shadow:none" @click.native="insertVar('SYSTIME')"/>
      </ButtonGroup>
      <ButtonGroup size="small" style="margin-left:5px;margin-top:-3px">
        <Button :disabled="disabled" v-for="item in buttons" :key="item.name" @click.native="insertVar(item.name)" style="box-shadow:none">
          <Icon v-if="item.icon" :type="item.icon" :title="'插入'+item.title"/>
          <span v-else :title="'插入'+item.title">{{item.name.charAt(0).toUpperCase()}}</span>
        </Button>
      </ButtonGroup>
    </div>
    <div :contenteditable="!disabled" class="editArea"
      :style="{minHeight: this.autosize.minRows*1.5+'em',maxHeight: this.autosize.maxRows*1.5+'em',fontSize: this.fontSize+'em'}"
      @keyup="keyUp" @click="myClick" v-html="editHtml">
    </div>
  </div>
</template>
<script>
export default {
  name: 'Editor',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    autosize: {
      type: Object,
      default () {
        return {width: '100%', minRows: 2, maxRows: 3}
      }
    },
    value: {
      type: String,
      default: ''
    },
    menus: {
      type: Array,
      default () {
        return [
          {name: 'account', title: '帐户号码', example: '4200888888'},
          {name: 'userNbr', title: '用户号码', example: '1898888888'},
          {name: 'currentFee', title: '当月费用', example: '188.88'}
        ]
      }
    },
    buttons: {
      type: Array,
      default () {
        return [
          {name: 'account', title: '帐户号码', icon: 'ios-card', example: '4200888888'},
          {name: 'userNbr', title: '用户号码', icon: 'ios-person', example: '18988888888'},
          {name: 'currentFee', title: '当月费用', icon: 'logo-yen', example: '188.88'}
        ]
      }
    }
  },
  data () {
    return {
      lastRange: null,
      editContainer: null,
      fontSize: 1,
      editHtml: this.toHTML(this.value)
    }
  },
  methods: {
    addFont () {
      this.fontSize += 0.1
    },
    subFont () {
      if (this.fontSize > 0.5) {
        this.fontSize -= 0.1
      }
    },
    toHTML (text) {
      let html = '<u contenteditable="false" class="sysVar" name="SYSDATE" title="当前日期">' + new Date().format('yyyy-MM-dd') + '</u>'
      text = text.replace(/\$\$SYSDATE\$/g, html)
      html = '<u contenteditable="false" class="sysVar" name="SYSTIME" title="当前时间">' + new Date().format('hh:mm:ss') + '</u>'
      text = text.replace(/\$\$SYSTIME\$/g, html)
      for (let v in this.menus) {
        let patt = new RegExp('\\$\\$' + this.menus[v].name + '\\$', 'g')
        html = '<u contenteditable="false" class="sysVar" name="' + this.menus[v].name + '" title="' + this.menus[v].title + '">'
        html += (this.menus[v].example ? this.menus[v].example : this.menus[v].title) + '</u>'
        text = text.replace(patt, html)
      }
      text = text.replace(/\n/g, '<br />')
      return text
    },
    toTEXT (html) {
      html = html.replace(/<u[^<]+?name="SYSDATE".+?u>/g, '$$$SYSDATE$')
      html = html.replace(/<u[^<]+?name="SYSTIME".+?u>/g, '$$$SYSTIME$')
      for (let v in this.menus) {
        let patt = new RegExp('<u[^<]+?name="' + this.menus[v].name + '".+?u>', 'g')
        let text = '$$$' + this.menus[v].name + '$'
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
      this.$emit('input', this.toTEXT(this.editContainer.innerHTML))
    },
    insertVar (varName) {
      if (this.editContainer && this.lastRange) {
        let text = null
        let title = null
        switch (varName) {
          case 'SYSDATE':
            title = '当前日期'
            text = new Date().format('yyyy-MM-dd')
            break
          case 'SYSTIME':
            title = '当前时间'
            text = new Date().format('hh:mm:ss')
            break
          default:
            for (let i = 0, l = this.menus.length; i < l; i++) {
              if (varName === this.menus[i].name) {
                text = this.menus[i].example ? this.menus[i].example : this.menus[i].title
                title = this.menus[i].title
                break
              }
            }
            if (!title) {
              for (let i = 0, l = this.buttons.length; i < l; i++) {
                if (varName === this.buttons[i].name) {
                  text = this.buttons[i].example ? this.buttons[i].example : this.buttons[i].title
                  title = this.buttons[i].title
                  break
                }
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
        this.$emit('input', this.toTEXT(this.editContainer.innerHTML))
        this.lastRange = window.getSelection().getRangeAt(0)
      }
    }
  }
}
</script>
<style scoped>
.toolBar {
  height: 30px;
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
  overflow: auto
}
.sysVar {
  color: #666666
}
</style>
