<template>
  <div class="wrapper">
    <Divider />
    <Row >
      <i-col span="4" class="cascaderLabel">请选择运营位：</i-col>
      <i-col span="20">
        <Cascader class="cascader" v-for="(item,index) in bindVals" :key="index" trigger="hover" :disabled="!editMode"
          :data="positionData" v-model="bindVals[index]" transfer @on-change="handleChange(index,$event)" />
        <Cascader class="cascader" :data="positionData" v-model="blank" placeholder="请选择运营位" :disabled="!editMode"
          transfer trigger="hover" @on-change="handleChange(-1,$event)"/>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    editMode: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  name: 'StrategyConfigStep4',
  data () {
    return {
      bindVals: [],
      blank: [],
      positionData: []
    }
  },
  mounted () {
    this.$httpReq('/common/operatePosition/names', null, 'get', (res) => {
      this.positionData = []
      let d = res.data.data
      let t = ''
      let o = null
      for (let i in d) {
        let n = this.value.indexOf(d[i].id)
        if (n >= 0) {
          this.bindVals.push([d[i].touchId, d[i].id])
        }
        if (d[i].touchId !== t) {
          t = d[i].touchId
          o = {value: t, label: d[i].touchName, children: []}
          this.positionData.push(o)
        }
        o.children.push({value: d[i].id, label: d[i].positionName})
      }
    })
  },
  methods: {
    handleChange (i, v) {
      if (i < 0) {
        if (this.value.indexOf(v[1]) < 0) {
          this.bindVals.push(v)
        }
        this.blank = []
      } else {
        if (v.length < 2 || this.value.indexOf(v[1]) >= 0) {
          this.bindVals.splice(i, 1)
        }
      }
      let val = []
      for (let j in this.bindVals) {
        val.push(this.bindVals[j][1])
      }
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>
.wrapper {
  background: #ffffff;
  text-align: left;
}
.cascaderLabel {
  font-size: 14px;
  font-weight: bold;
  text-align: right;
  line-height: 50px;
}
.cascader {
  margin: 10px 15px;
  width: 50%;
}
</style>
