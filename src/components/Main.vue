<template>
  <Layout>
    <Sider collapsible hide-trigger breakpoint="sm" v-model="isCollapsed" :class="'ivu-menu-'+theme">
      <img v-if="isCollapsed" src="../assets/logo1.png" style="width:60px;"/>
      <img v-else src="../assets/logo.png" style="width:200px"/>
      <!-- <div v-if="isCollapsed" class="logo">S</div>
      <div v-else class="logo1">Smart Trigger</div> -->
      <i-menu ref="sideMenu" accordion :theme="theme" :active-name="active" :open-names="opens" width="auto" :class="menuitemClasses" style="text-align:left;min-height:100vh" @on-select="activeMenu" @on-open-change="openChange">
        <template v-for="(m, index) in menus">
          <menu-item v-if="isCollapsed" :key="m.title" :name="''+index" @click.native="expandMenu">
            <Icon :type="m.icon" :title="m.title"></Icon>
          </menu-item>
          <menu-item v-else-if="!m.children||m.children.length<1" :key="m.title" :name="''+index">
             <Icon :type="m.icon"></Icon>
             <span>{{m.title}}</span>
          </menu-item>
          <Submenu v-else :key="m.title" :name="''+index">
            <template slot="title">
              <Icon :type="m.icon"></Icon>
              <span>{{m.title}}</span>
            </template>
            <template v-for="(m1, index1) in m.children">
              <menu-item :key="m1.title" :name="index +'-'+ index1">
                <Icon v-if="m1.icon" :type="m1.icon"></Icon>
                <span>{{m1.title}}</span>
              </menu-item>
            </template>
          </Submenu>
        </template>
      </i-menu>
    </Sider>
    <Layout style="background:#e8e8e8;">
      <div ref="header">
        <Row class="header">
          <i-col span="14">
            <!--  侧边栏折叠按钮  -->
            <Button @click.native="expandMenu" :class="rotateIcon" style="box-shadow:none;padding:0" type="text">
              <Icon type="ios-menu" size="32"></Icon>
            </Button>
            <!-- 面包屑导航 -->
            <Breadcrumb style="display:inline-block;margin-left:8px">
              <BreadcrumbItem v-for="(bc,index) in currentPath" :key="index" :to="bc.link" @click.native="myClick(bc.level)">
                <Icon :type="bc.icon"></Icon>
                {{bc.title}}
              </BreadcrumbItem>
            </Breadcrumb>
          </i-col>
          <i-col span="10" style="text-align:right">
            <!-- 用户信息 -->
            <Dropdown transfer trigger="click" placement="bottom-end" style="cursor:default">
              <Avatar icon="md-person"/>
              <span>&emsp;{{this.$store.state.currentUser.nickName}}&emsp;</span>
              <Icon type="ios-arrow-down"/>
              <div slot="list" style="width:200px;text-align:left;padding:10px;line-height:25px">
                <div style="display:inline-block">
                  登录帐号：{{this.$store.state.currentUser.account}}<br />
                  用户昵称：{{this.$store.state.currentUser.nickName}}<br />
                  所属省市：{{this.$store.state.currentUser.provinceName}}<br />
                  所属县市：{{this.$store.state.currentUser.cityName?this.$store.state.currentUser.cityName.join('-'):null}}<br />
                  用户角色：{{this.$store.state.currentUser.role}}<br />
                  手机号码：{{this.$store.state.currentUser.mobile}}<br />
                  界面风格：
                  <RadioGroup v-model="theme">
                    <Radio label="dark">
                      <Icon type="ios-list-box-outline" size="16" style="background-color:#495060;color:#5cadff;border:solid 1px #dddee1;padding:2px"/>
                    </Radio>
                    <Radio label="light">
                      <Icon type="ios-list-box-outline" size="16" style="background-color:#f8f8f9;border:solid 1px #dddee1;padding:2px"/>
                    </Radio>
                  </RadioGroup>
                </div>
                <div style="line-height:40px;text-align:center">
                  <Button size="small" @click="()=>this.showModal=true">修改密码</Button>&emsp;&emsp;
                  <Button size="small" @click="logout">退出登录</Button>
                </div>
              </div>
            </Dropdown>
          </i-col>
        </Row>
        <Row class="tagsbar">
          <i-col span="24">
            <Dropdown transfer placement="bottom-start" style="vertical-align:top" @on-click="(name)=>this.$store.commit('closeTags', name)">
              <Button type="text" size="small" style="box-shadow:none">
                <Icon type="ios-close-circle-outline" size="24"/>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="closeAll">关闭所有</DropdownItem>
                <DropdownItem name="closeOther">关闭其他</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div style="display:inline-block;overflow:hidden" @mousewheel="handleMousewheel" @DOMMouseScroll="handleMousewheel">
              <div ref="tags" :style="{position:'relative',left:tagsOffset+'px',whiteSpace:'nowarp'}">
                <Tag v-for="(item,index) in tags" :key="index"
                  type="dot"
                  :color="item===currentPage?'primary':'default'"
                  :name="item"
                  @on-close="closeTag"
                  @click.native="linkTo(item)"
                  :closable="item!=='home'">{{getTagTitle(item)}}</Tag>
              </div>
            </div>
          </i-col>
        </Row>
      </div>
      <Content class="content">
           <router-view></router-view>
      </Content>
      <Modal title="修改用户登录密码" okText="保存" v-model="showModal" @on-ok="savePsd" width="420">
        <Form ref="UserPsd" :label-width="150" :model="userPsd" :rules="rules" style="width:350px">
          <FormItem label="请输入旧登录密码" prop="oldPassword">
            <Input type="password" v-model="userPsd.oldPassword" placeholder="请输入旧登录密码" clearable/>
          </FormItem>
          <FormItem label="请输入新登录密码" prop="newPassword">
            <Input type="password" v-model="userPsd.newPassword" placeholder="请输入新登录密码" clearable/>
          </FormItem>
          <FormItem label="请再次输入新密码" prop="repeatPassword">
            <Input type="password" v-model="userPsd.repeatPassword" placeholder="请再次输入新密码" clearable/>
          </FormItem>
        </Form>
      </Modal>
    </Layout>
  </Layout>
</template>

<script>
export default {
  name: 'Main',
  data () {
    const checkPassword = (rule, value, callback) => {
      if (value !== this.userPsd.newPassword) {
        callback(new Error('两次输入的新密码不一样！'))
      } else {
        callback()
      }
    }
    return {
      tagsOffset: 0,
      isCollapsed: true,
      theme: this.$store.state.currentUser.theme,
      menus: [],
      showModal: false,
      userPsd: {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      rules: {
        oldPassword: [{required: true, message: '旧登录密码不能为空！', trigger: 'blur, change'}],
        newPassword: [{required: true, type: 'string', min: 6, message: '登录密码长度不能小于6位！', trigger: 'blur, change'}],
        repeatPassword: [{required: true, type: 'string', min: 6, message: '登录密码长度不能小于6位！', trigger: 'blur, change'}, {validator: checkPassword, trigger: 'blur'}]
      }
    }
  },
  mounted () {
    this.$httpReq('/userMenus/' + this.$store.state.currentUser.userId, '', 'get', (res) => {
      this.menus = res.data.data
      this.$router.push('/')
      if (this.menus !== null) {
        this.isCollapsed = false
      }
    })
  },
  computed: {
    active () {
      return this.$store.state.currentPage
    },
    rotateIcon () {
      return this.isCollapsed ? 'rotate-icon' : ''
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    currentPage () {
      return this.$store.state.currentPage
    },
    currentPath () {
      let breadCrumbData = [{
        icon: 'ios-home',
        title: '首页',
        link: '/',
        level: 0
      }]
      if (this.$store.state.currentPage !== 'home') {
        let t = this.$store.state.currentPage.split('-')
        breadCrumbData.push({
          title: this.menus[t[0]].title,
          link: this.menus[t[0]].action,
          level: this.menus[t[0]].level
        })
        if (t.length > 1) {
          breadCrumbData.push({
            title: this.menus[t[0]].children[t[1]].title,
            link: this.menus[t[0]].children[t[1]].action,
            level: this.menus[t[0]].children[t[1]].level
          })
        }
      }
      return breadCrumbData
    },
    tags () {
      return this.$store.state.tags
    },
    opens () {
      return this.$store.state.openMenus
    }
  },
  methods: {
    logout () {
      this.$httpReq('/logout', {}, 'get', (res) => {
        this.$store.commit('logout')
      })
    },
    savePsd () {
      this.$refs['UserPsd'].validate((valid) => {
        if (valid) {
          this.$httpReq('/common/modiPsd', this.userPsd, 'edit', (res) => {
            this.$Message.success('密码修改成功！请牢记新密码。')
          })
        } else {
          setTimeout(() => {
            this.showModal = true
          }, 200)
        }
      })
    },
    myClick (level) {
      this.$store.commit('setCurrentLevel', level)
    },
    expandMenu () {
      this.isCollapsed = !this.isCollapsed
      let act = this.$store.state.currentPage
      if (!this.isCollapsed) {
        this.$store.commit('setCurrentPage', 'home')
        this.$nextTick(() => {
          this.$store.commit('setCurrentPage', act)
          this.$refs.sideMenu.updateOpened()
          this.$refs.sideMenu.updateActiveName()
        })
      }
    },
    openChange (names) {
      this.$store.commit('setOpenMenus', names)
    },
    activeMenu (name) {
      if (!this.isCollapsed) {
        this.$store.commit('setCurrentPage', name)
        this.$store.commit('addTag', name)
        let t = name.split('-')
        if (t.length > 1) {
          this.$router.push(this.menus[t[0]].children[t[1]].action)
          this.$store.commit('setCurrentLevel', this.menus[t[0]].children[t[1]].level)
        } else {
          this.$router.push(this.menus[t[0]].action)
          this.$store.commit('setCurrentLevel', this.menus[t[0]].level)
        }
      }
    },
    getTagTitle (name) {
      let t = name.split('-')
      if (t.length > 1) {
        return this.menus[t[0]].children[t[1]].title
      } else if (t[0] === 'home') {
        return '首页'
      } else {
        return this.menus[t[0]].title
      }
    },
    closeTag (event, name) {
      this.$store.commit('removeTag', name)
      this.linkTo(this.$store.state.currentPage)
    },
    linkTo (name) {
      this.$store.commit('setCurrentPage', name)
      let t = name.split('-')
      let link = ''
      let level = 0
      if (t.length > 1) {
        link = this.menus[t[0]].children[t[1]].action
        level = this.menus[t[0]].children[t[1]].level
      } else if (t[0] === 'home') {
        link = '/'
      } else {
        link = this.menus[t[0]].action
        level = this.menus[t[0]].action
      }
      this.$router.push(link)
      this.$store.commit('setCurrentLevel', level)
    },
    handleMousewheel (event) {
      let el = this.$refs['tags']
      let w = this.$refs['header'].clientWidth - 36
      w = el.clientWidth < w ? el.clientWidth : w
      if (event.type === 'mousewheel' || event.type === 'DOMMouseScroll') {
        event.preventDefault()
        let delta = event.wheelDelta ? event.wheelDelta / 120 : -(event.detail || 0) / 3
        let temp = this.tagsOffset + delta * 20
        if (el.scrollWidth + temp < w) {
          this.tagsOffset = w - el.scrollWidth - 10
        } else {
          this.tagsOffset = temp > 0 ? 0 : temp
        }
      }
    }
  }
}
</script>
<style scoped>
  .header{
    background: #f8f8f8;
    height: 60px;
    line-height: 60px;
    text-align: left;
    padding: 0 10px;
  }
  .tagsbar{
    background: #f8f8f8;
    margin: 2px 0;
    height: 38px;
    line-height: 34px;
    text-align: left;
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
  }
  .content{
    background: #f8f8f8;
  }
  .rotate-icon{
    transform: rotate(90deg);
    -ms-transform:rotate(-90deg);
    -moz-transform:rotate(-90deg);
    -webkit-transform:rotate(-90deg);
    -o-transform:rotate(-90deg);
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 24px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
    }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
  .logo {
    height: 60px;
    line-height: 60px;
    background: #2d8cf0;
    color: #ffffff;
    font-family: Blackadder ITC,Fantasy;
    font-size: 48px;
    font-weight: 1000;
    border-radius: 10px;
  }
  .logo1 {
    height: 60px;
    line-height: 60px;
    background: #2d8cf0;
    color: #ffffff;
    font-family: Blackadder ITC,Fantasy;
    font-size: 36px;
    font-weight: 1000;
    border-radius: 10px;
  }
</style>
