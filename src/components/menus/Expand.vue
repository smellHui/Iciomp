<template>
  <div style="margin-left:-30px;margin-right:-30px">
    <template v-if="editMode">
      <Form ref="rowMenu" :label-width="100" :model="rowData" :rules="rules">
        <Row>
          <i-col span="8">
            <FormItem label="父菜单标题" prop="parentID">
              <Select v-model="rowData.parentID" transfer filterable placeholder="请选择父菜单标题">
                <Option v-for="item in menuNames" :key="item.menuID" :value="item.menuID">{{item.title}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="组件名称">
              <Input type="text" v-model="rowData.action" placeholder="请填写菜单组件名称"/>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="排序标志" prop="order">
              <Input type="text" v-model="rowData.order" placeholder="请填写菜单排序标志"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="8">
            <FormItem label="菜单标题" prop="title">
              <Input type="text" v-model="rowData.title" placeholder="请键入菜单的标题"/>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="菜单图标">
              <Input type="text" v-model="rowData.icon" placeholder="请定义菜单图标"/>
            </FormItem>
          </i-col>
          <i-col span="8">
            <Icon :type="rowData.icon" size="32" style="margin-left:10px"/>
          </i-col>
        </Row>
      </Form>
    </template>
    <template v-else>
      <Row class="row">
        <i-col span="3" class="label">父菜单ID：</i-col>
        <i-col span="5">&emsp;{{rowData.parentID}}</i-col>
        <i-col span="3" class="label">父菜单标题：</i-col>
        <i-col span="5">&emsp;{{getMenuTitle(rowData.parentID)}}</i-col>
        <i-col span="3" class="label">组件名称：</i-col>
        <i-col span="5">&emsp;{{rowData.action}}</i-col>
      </Row>
      <Row class="row">
        <i-col span="3" class="label">菜单ID：</i-col>
        <i-col span="5">&emsp;{{rowData.menuID}}</i-col>
        <i-col span="3" class="label">菜单标题：</i-col>
        <i-col span="5">&emsp;{{rowData.title}}</i-col>
        <i-col span="3" class="label">菜单图标：</i-col>
        <i-col span="5">&emsp;<Icon :type="rowData.icon" size="22"/></i-col>
      </Row>
      <Row class="row">
        <i-col span="3" class="label">排序标志：</i-col>
        <i-col span="5">&emsp;{{rowData.order}}</i-col>
        <i-col span="3" class="label">创建时间：</i-col>
        <i-col span="5">&emsp;{{rowData.createTime}}</i-col>
        <i-col span="3" class="label">修改时间：</i-col>
        <i-col span="5">&emsp;{{rowData.editTime}}</i-col>
      </Row>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Expand',
  props: {
    rowData: {
      type: Object
    },
    editMode: {
      type: Boolean,
      default () {
        return false
      }
    },
    menuNames: {
      type: Array
    }
  },
  data () {
    return {
      rules: {
        parentID: [{required: true, pattern: /^[1-9][0-9]{7}$/, message: '父菜单标题不能为空！', triggle: 'blur, change'}],
        title: [{required: true, message: '菜单标题不能为空！', triggler: 'blur, change'}],
        order: [{required: true, pattern: /^[0-9]{1,4}$/, message: '排序标志必须为不大于4位的数字！', triggle: 'blur, change'}]
      }
    }
  },
  methods: {
    getMenuTitle (id) {
      for (let i = 0, l = this.menuNames.length; i < l; i++) {
        if (this.menuNames[i].menuID === id) {
          return this.menuNames[i].title
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.row {
  height: 24px;
  line-height: 24px;
  text-align: left
}
.label {
  text-align: right;
  color: #2db7f5;
}
</style>
