<template>
  <div>
    <Row type="flex" justify="flex-start" style="margin-left: 50px">
      <i-col class="icol" span="6">
        <p class="title">模板名称</p>
        <Input v-model="value" placeholder="模板名称..." style="width: 300px"/>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">适用场景</p>
        <Select v-model="model8" clearable style="width:300px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="3">
        <p class="title">上线状态</p>
        <Select v-model="model8" clearable style="width:100px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="3">
        <p class="title">审核状态</p>
        <Select v-model="model8" clearable style="width:100px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">开始日期</p>
        <DatePicker type="date" :options="options3" placeholder="开始日期"
                    style="width: 215px;margin-right: 10px"></DatePicker>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">失效日期</p>
        <DatePicker type="date" :options="options3" placeholder="失效日期"
                    style="width: 215px;margin-right: 10px"></DatePicker>
      </i-col>
    </Row>
    <Row class="code-row-bg">
      <Button type="primary" shape="circle" icon="ios-search">搜索</Button>
      <Button type="primary" shape="circle" icon="ios-search">重置</Button>
    </Row>
    <Row class="row">
      <i-col span="22">
        <div class="title">
          <Icon type="ios-list"/>
          话术列表
        </div>
      </i-col>
      <i-col span="2">
        <Button icon="ios-add" type="primary" size="small" @click="showModal = true">新增话术模板
        </Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="24">
        <Table ref="tabDataList" :columns="columns" :data="rowList" border stripe></Table>
      </i-col>
    </Row>
    <speechAdd :show="showModal" @dismissAddProductView="showModal = false"></speechAdd>
  </div>
</template>

<script>
import speechAdd from './speechAdd'
export default {
  name: 'products',
  components: {
    speechAdd
  },
  data () {
    return {
      showModal: false,
      columns: [
        {
          title: '模板名称',
          key: 'name'
        },
        {
          title: '模板内容',
          key: 'name'
        },
        {
          title: '类型',
          key: 'name'
        },
        {
          title: '场景',
          key: 'name'
        },
        {
          title: '时间',
          key: 'name'
        },
        {
          title: '状态',
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
