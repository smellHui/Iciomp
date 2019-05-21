<template>
  <div style="margin-left:-30px;margin-right:-30px">
    <template v-if="editMode">
      <Form ref="rowMenu" :label-width="100" :model="rowData" :rules="rules">
        <Row>
          <i-col span="8">
            <FormItem label="登录帐号" prop="account">
              <Input type="text" v-model="rowData.account" placeholder="请填写用户登录帐号"/>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="用户昵称" prop="nickName">
              <Input type="text" v-model="rowData.nickName" placeholder="请填写用户昵称"/>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="手机号码" prop="mobile">
              <Input type="text" v-model="rowData.mobile" placeholder="请填写用户手机号码"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="8">
            <FormItem label="所属省市" prop="province">
              <Select filterable placeholder="请选择所属省市" v-model="rowData.provinceCode" @on-change="getCitys">
                <Option v-for="item in provinces" :key="item.code" :value="item.code">{{item.name}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="所属县市" prop="city">
              <Cascader filterable :clearable="false" transfer placeholder="请选择所属县市" :data="citys"
                :disabled="!canSelectCity" v-model="rowData.cityCode"
                @on-change="changeCityCode"
                :render-format="(label)=>label.join('.')">
              </Cascader>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="用户角色" prop="role">
              <Select clearable filterable placeholder="请选择用户角色" v-model="rowData.role">
                <Option v-for="item in userRoles" :key="item.title" :value="item.value">{{item.title}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row class="row">
          <i-col span="3" class="label">修改时间：</i-col>
          <i-col span="5">&emsp;{{rowData.updateTime}}</i-col>
          <i-col span="3" class="label">创建者：</i-col>
          <i-col span="5">&emsp;{{rowData.creator}}</i-col>
          <i-col span="3" class="label">创建时间：</i-col>
          <i-col span="5">&emsp;{{rowData.createTime}}</i-col>
        </Row>
        <Row class="row">
          <i-col span="3" class="label">用户头像：</i-col>
          <i-col span="5">&emsp;
            <Avatar v-if="rowData.avatar===null" icon="md-person"/>
            <Avatar v-else :src="rowData.avatar"/>
          </i-col>
          <i-col span="16" style="text-align:center">
            <Button type="primary" size="small" @click="grantAuthority">精准授权</Button>
            <Button type="primary" size="small" style="margin-left:20px" @click="resetPassword">密码重置</Button>
          </i-col>
        </Row>
      </Form>
    </template>
    <template v-else>
      <Row class="row">
        <i-col span="3" class="label">登录帐号：</i-col>
        <i-col span="5">&emsp;{{rowData.account}}</i-col>
        <i-col span="3" class="label">用户改昵称：</i-col>
        <i-col span="5">&emsp;{{rowData.nickName}}</i-col>
        <i-col span="3" class="label">手机号码：</i-col>
        <i-col span="5">&emsp;{{rowData.mobile}}</i-col>
      </Row>
      <Row class="row">
        <i-col span="3" class="label">所属省市：</i-col>
        <i-col span="5">&emsp;{{getProvinceName(rowData.provinceCode)}}</i-col>
        <i-col span="3" class="label">所属县市：</i-col>
        <i-col span="5">&emsp;{{rowData.cityName ? rowData.cityName.join('.') : null}}</i-col>
        <i-col span="3" class="label">用户角色：</i-col>
        <i-col span="5">&emsp;{{rowData.role}}</i-col>
      </Row>
      <Row class="row">
        <i-col span="3" class="label">修改时间：</i-col>
        <i-col span="5">&emsp;{{rowData.updateTime}}</i-col>
        <i-col span="3" class="label">创建者：</i-col>
        <i-col span="5">&emsp;{{rowData.creator}}</i-col>
        <i-col span="3" class="label">创建时间：</i-col>
        <i-col span="5">&emsp;{{rowData.createTime}}</i-col>
      </Row>
      <Row class="row">
        <i-col span="3" class="label">用户头像：</i-col>
        <i-col span="5">&emsp;
          <Avatar v-if="rowData.avatar===null" icon="md-person"/>
          <Avatar v-else :src="rowData.avatar"/>
        </i-col>
        <i-col span="16">&emsp;</i-col>
      </Row>
    </template>
    <Modal
      v-if="editMode"
      v-model="showModal"
      title="用户权限授予"
      okText="保存"
      cancelText="取消"
      :styles="{textAlign: 'center'}"
      transfer
      @on-ok="saveUserAuthoritys"
      :closable="false"
      :mask-closable="false">
      <Transfer
        :data="resources"
        :target-keys="userAuthoritys"
        filterable
        :listStyle="listStyle"
        :titles="titles"
        @on-change="myChange">
      </Transfer>
    </Modal>
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
    provinces: {
      type: Array
    },
    userRoles: {
      type: Array,
      default () {
        return [
          {title: '默认', value: 'Default'},
          {title: '超级用户', value: 'Admin'}
        ]
      }
    }
  },
  data () {
    return {
      showModal: false,
      resources: [],
      userAuthoritys: [],
      canSelectCity: false,
      citys: [],
      titles: ['待选权限', this.rowData.account + ' 拥有权限'],
      rules: {
        account: [{required: true, type: 'string', min: 5, message: '登录帐号长度不能小于5位！', triggler: 'blur, change'}],
        mobile: [{pattern: /^1[35789][0-9]{9}$/, message: '请输入正确的手机号码！', triggle: 'blur, change'}]
      },
      listStyle: {
        width: '210px',
        height: '300px',
        textAlign: 'left'
      }
    }
  },
  mounted () {
    if (this.editMode) {
      this.getCitys(this.rowData.provinceCode)
    }
  },
  methods: {
    // 取得省市名称
    getProvinceName (province) {
      if (province) {
        for (let i = 0, len = this.provinces.length; i < len; i++) {
          if (this.provinces[i].code === province) {
            return this.provinces[i].name
          }
        }
      } else {
        return null
      }
    },
    // 获取县市列表
    getCitys (provinceCode) {
      if (provinceCode >= 110000) {
        this.$httpReq('/common/citys', {province: provinceCode}, 'get', (res) => {
          this.canSelectCity = true
          this.citys = res.data.data
        })
      } else {
        this.canSelectCity = false
        this.citys = []
      }
    },
    // 县市数据变化时触发
    changeCityCode (value, selectData) {
      if (value !== null && selectData != null) {
        let cityName = []
        for (let i = 0, len = selectData.length; i < len; i++) {
          cityName.push(selectData[i].label)
        }
        this.rowData.cityName = cityName
      }
    },
    // 重置用户登录密码
    resetPassword () {
      this.$httpReq('/user/resetPassword/' + this.rowData.userId, {}, 'edit', (res) => {
        this.$Message.success('密码重置成功！')
      })
    },
    // 获取资源及用户权限数据
    getResources () {
      this.$httpReq('/common/getUserAuthority/' + this.rowData.userId, {}, 'get', (res) => {
        this.resources = res.data.data.resourceList
        this.userAuthoritys = res.data.data.userAuthoritys
      })
    },
    // 访问授权
    grantAuthority () {
      this.showModal = true
      this.getResources()
    },
    // 所选授权数据发生改变时触发
    myChange (targetKeys) {
      this.userAuthoritys = targetKeys
    },
    // 保存授权数据
    saveUserAuthoritys () {
      this.$httpReq('/user/grantAuthoritys/' + this.rowData.userId, {
        userId: this.rowData.userId,
        authoritys: this.userAuthoritys
      }, 'edit', (res) => {
        this.$Message.success('用户授权信息保存成功！')
      })
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
