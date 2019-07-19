<template>
    <div style="margin-left: 40px;margin-top:12px;">
      <template v-if="editMode">
        <div class="title" style="margin-bottom:5px">其他信息</div>
        <Row>
          <i-col span="12">
            <label class="label1">创建时间：</label>
            <span>{{createTime}}</span>
          </i-col>
          <i-col span="12">
            <label class="label1">修改时间：</label>
            <span>{{updateTime}}</span>
          </i-col>
        </Row>
      </template>
    </div>
</template>

<script>
export default {
  name: 'OtherView',
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    createTime: {
      type: String
    },
    updateTime: {
      type: String
    }
  }
}
</script>

<style scoped>
  .title {
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bolder;
    padding-left: 10px;
  }
</style>
