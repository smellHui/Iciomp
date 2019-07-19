<template>
  <div class="wrapper">
    <Tabs type="card" :animated="false">
      <TabPane label="客户基础信息筛选" name="name1">
        <template v-for="item in commonCondition">
          <Row class="condition" v-for="condition in item.data" :key="condition.key">
            <i-col span="4" class="label">{{condition.labelName}}</i-col>
            <i-col span="20">
              <CheckboxGroup v-model="commonLabels[condition.labelCode]" :disabled="!editMode">
                <Checkbox v-for="(attribute,index) in condition.data" :key="index" :label="attribute.attValue" :disabled="!editMode">{{attribute.attName}}</Checkbox>
              </CheckboxGroup>
            </i-col>
          </Row>
        </template>
      </TabPane>
      <TabPane label="策略标签库筛选" name="name2">
        <div v-for="(item,index) in bindVals" :key="index">
          <div class="straBox">
            <Row class="cascaderRow">
              <i-col span="4" class="cascaderLabel">请选择策略标签库</i-col>
              <i-col span="18" style="padding-top:12px;">
                <Cascader  placeholder="请选择策略标签库" style="width:40%" :disabled="!editMode"
                transfer trigger="hover" size="large"
                :data="strategyLabelLibs" filterable
                v-model="bindVals[index]"
                @on-change="handleChange(index, $event)" />
              </i-col>
              <i-col span="2" class="remove"><Icon type="ios-close-circle-outline" size="36" @click.native="removeStra(index)"/></i-col>
            </Row>
            <template v-if="straLibsData[bindVals[index][1]]">
              <Row class="optionRow" v-for="(o,i) in straLibsData[bindVals[index][1]].labelParams" :key="i">
                <i-col span="4" class="optionLabel">{{o.fieldDesc}}：</i-col>
                <i-col span="20">
                  <RadioGroup v-if="o.showType==1" v-model="libLabels[bindVals[index][1]][o.fieldCode]" :disabled="!editMode">
                    <Radio v-for="(opt, idx) in o.fieldValue" :key="idx" :label="opt.value+''" :disabled="!editMode">{{opt.name}}</Radio>
                  </RadioGroup>
                  <CheckboxGroup v-if="o.showType==2" v-model="libLabels[bindVals[index][1]][o.fieldCode]" :disabled="!editMode">
                    <Checkbox v-for="(opt, idx) in o.fieldValue" :key="idx" :label="opt.value+''" :disabled="!editMode">{{opt.name}}</Checkbox>
                  </CheckboxGroup>
                  <Input v-if="o.showType==3" type="text" style="width:20%" v-model="libLabels[bindVals[index][1]][o.fieldCode]" :disabled="!editMode" />
                  <Between v-if="o.showType==4" :styles="{width:'10%'}" v-model="libLabels[bindVals[index][1]][o.fieldCode]" :disabled="!editMode" />
                </i-col>
              </Row>
            </template>
          </div>
          <Divider />
        </div>
        <div class="straBox">
          <Row class="cascaderRow">
            <i-col span="4" class="cascaderLabel">请选择策略标签库</i-col>
            <i-col span="20" style="padding-top:12px;">
              <Cascader  placeholder="请选择策略标签库" style="width:40%" :disabled="!editMode"
              transfer trigger="hover" size="large"
              v-model="blank" filterable
              :data="strategyLabelLibs"
              @on-change="handleChange(-1, $event)" />
            </i-col>
          </Row>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Between from '@/components/strategy/Between'
export default {
  name: 'StrategyConfigStep2',
  components: {
    Between
  },
  props: {
    commonLabels: {
      type: Object,
      default () {
        return {}
      }
    },
    libLabels: {
      type: Object,
      default () {
        return {}
      }
    },
    editMode: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      commonCondition: [],
      strategyLabelLibs: [],
      bindVals: [],
      blank: [],
      straLibsData: {}
    }
  },
  mounted () {
    this.$httpReq('/common/dataTags', null, 'get', (res) => {
      this.commonCondition = res.data.data
    })
    this.$httpReq('/common/listStrategyLabelLibs', null, 'get', (res) => {
      this.strategyLabelLibs = []
      let menu = ''
      let obj = null
      let data = res.data.data
      for (let i = 0; i < data.length; i++) {
        if (this.libLabels[data[i].id]) {
          this.bindVals.push([data[i].straLabelMenu, data[i].id])
        }
        if (data[i].straLabelMenu !== menu) {
          menu = data[i].straLabelMenu
          obj = {value: menu, label: menu, children: []}
          this.strategyLabelLibs.push(obj)
        }
        obj.children.push({value: data[i].id, label: data[i].straLabelName})
      }
    })
    let arr = []
    for (let o in this.libLabels) {
      arr.push(o)
    }
    if (arr.length > 0) {
      this.$httpReq('/common/straLabelLibs/ids', arr, 'post', (res) => {
        for (let n in res.data.data) {
          let o = res.data.data[n]
          o.labelParams = JSON.parse(o.labelParams)
          this.straLibsData[o.id] = o
        }
      })
    }
  },
  methods: {
    handleChange (i, v) {
      if ((v.length > 1) && (!this.straLibsData[v[1]])) {
        this.$httpReq('/common/straLabelLib/' + v[1], null, 'get', (res) => {
          let o = res.data.data
          o.labelParams = JSON.parse(o.labelParams)
          this.straLibsData[v[1]] = o
          this.myChange(i, v)
        })
      } else {
        this.myChange(i, v)
      }
    },
    myChange (i, v) {
      if (i < 0) {
        if (!this.libLabels[v[1]]) {
          this.libLabels[v[1]] = {}
          this.bindVals.push(v)
        }
        this.blank = []
      } else {
        if (v.length < 2 || this.libLabels[v[1]]) {
          this.bindVals.splice(i, 1)
        } else {
          this.libLabels[v[1]] = {}
          this.bindVals[i] = v
        }
        for (let id in this.libLabels) {
          let del = true
          for (let n in this.bindVals) {
            let o = this.bindVals[n]
            if (id === o[1]) {
              del = false
              break
            }
          }
          if (del) {
            delete this.libLabels[id]
          }
        }
      }
    },
    removeStra (index) {
      delete this.libLabels[this.bindVals[index][1]]
      this.bindVals.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.wrapper {
  background: #ffffff;
  margin: 5px;
  padding: 5px;
  text-align: left;
}
.condition {
  line-height: 30px;
  margin-bottom: 10px;
}
.label {
  line-height: 30px;
  text-align: right;
  padding-right: 10px;
}
.straBox {
  min-height: 150px;
  border: solid 1px #dcdee2;
  border-radius: 12px;
  padding-bottom: 10px;
}
.cascaderRow {
  background: #dcdee2;
  line-height: 60px;
  border-radius: 12px 12px 0 0;
}
.optionRow {
  line-height: 35px;
}
.cascaderLabel {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
.optionLabel {
  text-align: right;
  padding-right: 8px;
  vertical-align: middle;
}
.remove {
  cursor: default;
  text-align: right;
  padding-right: 10px;
}
</style>
