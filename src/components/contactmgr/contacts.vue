<template>
  <div>
    <Row type="flex" justify="flex-start" style="margin-left: 50px">
      <i-col class="icol" span="6">
        <p class="title">触点编码</p>
        <Input v-model="value" placeholder="Enter something..." style="width: 300px"/>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">触点来源</p>
        <Input v-model="value" placeholder="Enter something..." style="width: 300px"/>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">月接触总阀值</p>
        <InputNumber :max="10" :min="1" v-model="value1"></InputNumber>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">接触媒介</p>
        <Select v-model="model8" clearable style="width:200px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">接触时效</p>
        <Select v-model="model8" clearable style="width:200px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">开关</p>
        <i-switch size="large"/>
      </i-col>
    </Row>
    <Row class="code-row-bg">
      <Button type="primary" shape="circle" icon="ios-search">编辑</Button>
      <Button type="primary" shape="circle" icon="ios-search">运营位</Button>
    </Row>
    <Row class="row">
      <i-col span="22">
        <div class="title">
          <Icon type="ios-list"/>
          产品列表
        </div>
      </i-col>
      <i-col span="2">
        <Button icon="ios-add" type="primary" size="small">新增触点
        </Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="24">
        <Table ref="tabDataList" :columns="columns" :data="rowList" border stripe></Table>
      </i-col>
    </Row>
  </div>
</template>

<script>export default {
  name: 'products',
  data () {
    return {
      value1: 1,
      columns: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '编码',
          key: 'name'
        },
        {
          title: '单用户日接触频次',
          key: 'name'
        },
        {
          title: '用户月次接触阈值',
          key: 'name'
        },
        {
          title: '日营销时间',
          key: 'name'
        },
        {
          title: '创建人',
          key: 'name'
        },
        {
          title: '生效时间',
          key: 'name'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      rowList: [
        {
          name: 'John Brown'
        },
        {
          name: 'Jim Green'
        },
        {
          name: 'Joe Black'
        },
        {
          name: 'Jon Snow'
        }
      ],
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ]
    }
  }
}
</script>

<style scoped>
  .code-row-bg {
    margin-top: 20px;
  }

  .row {
    height: 32px;
    line-height: 32px;
    margin: 5px auto;
    text-align: left
  }

  .icol {
    display: flex;
    margin-top: 20px;
    margin-left: 30px;
    align-items: center;
  }

  .title {
    padding-right: 10px
  }
</style>
