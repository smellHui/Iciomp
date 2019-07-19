import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Events from '@/components/events/Events'
import EventsAudit from '@/components/events/EventsAudit'
import Menus from '@/components/menus/Menus'
import Opportunity from '@/components/opportunities/Opportunity'
import OpportunityAudit from '@/components/opportunities/OpportunityAudit'
import Words from '@/components/words/Words'
import WordsAudit from '@/components/words/WordsAudit'
import Users from '@/components/users/Users'
import Resources from '@/components/resources/Resources'
import Product from '@/components/product/Product'
import ProductAudit from '@/components/product/ProductAudit'
import Jobs from '@/components/jobs/Jobs'
import EventOverview from '@/components/report/EventOverview'
import StrategyDetail from '@/components/report/StrategyDetail'
import OrderDetail from '@/components/report/OrderDetail'
import TransactionStatistics from '@/components/report/TransactionStatistics'
import products from '@/components/productmgr/products'
import speechs from '@/components/speechmgr/speechs'
import wordAudit from '@/components/speechmgr/wordAudit'
import touchs from '@/components/touchmgr/touchs'
import operations from '@/components/touchmgr/operations'
import BlackUsers from '@/components/users/BlackUsers'
import StrategyLabel from '@/components/strategy/StrategyLabel'
import Strategy from '@/components/strategy/Strategy'
import StrategyConfig from '@/components/strategy/StrategyConfig'

Vue.use(Router)

const vueRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/sys/menus',
      name: 'Menus',
      component: Menus
    },
    {
      path: '/contact/events',
      name: 'Events',
      component: Events
    },
    {
      path: '/contact/eventsAudit',
      name: 'EventsAudit',
      component: EventsAudit
    },
    {
      path: '/contact/opportunities',
      name: 'Opporrunity',
      component: Opportunity
    },
    {
      path: '/contact/opportunitiesAudit',
      name: 'OpporrunityAudit',
      component: OpportunityAudit
    },
    {
      path: '/contact/words',
      name: 'Words',
      component: Words
    },
    {
      path: '/contact/wordsAudit',
      name: 'WordsAudit',
      component: WordsAudit
    },
    {
      path: '/sys/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/sys/resource',
      name: 'Resources',
      component: Resources
    },
    {
      path: '/product/product',
      name: 'Product',
      component: Product
    },
    {
      path: '/product/productAudit',
      name: 'ProductAudit',
      component: ProductAudit
    },
    {
      path: '/sys/jobs',
      name: 'Jobs',
      component: Jobs
    },
    {
      path: '/report/eventOverview',
      name: 'EventOverview',
      component: EventOverview
    },
    {
      path: '/report/strategyDetail',
      name: 'StrategyDetail',
      component: StrategyDetail
    },
    {
      path: '/report/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/report/transactionStatistics',
      name: 'TransactionStatistics',
      component: TransactionStatistics
    },
    {
      path: '/product/products',
      name: 'products',
      component: products
    },
    {
      path: '/speech/speechs',
      name: 'speechs',
      component: speechs
    },
    {
      path: '/speech/wordAudit',
      name: 'wordAudit',
      component: wordAudit
    },
    {
      path: '/touch/touchs',
      name: 'touchs',
      component: touchs
    },
    {
      path: '/touch/operations',
      name: 'operations',
      component: operations
    },
    {
      path: '/user/blackUsers',
      name: 'blackUsers',
      component: BlackUsers
    },
    {
      path: '/strategy/strategyLabel',
      name: 'StrategyLabel',
      component: StrategyLabel
    },
    {
      path: '/strategy/strategy',
      name: 'Strategy',
      component: Strategy
    },
    {
      path: '/strategy/strategyConfig',
      name: 'StrategyConfig',
      component: StrategyConfig
    }
  ]
})
export default vueRouter
