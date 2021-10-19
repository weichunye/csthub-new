import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
      {
          path: '/login',
          name: 'login',
          component: () => import( './views/login.vue')
      },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },{
          path: '/projects',
          name: 'projects',
          component: () => import( './views/modules/projects.vue')
      },
      {
          path: '/register',
          name: 'register',
          component: () => import( './views/register.vue')
      },
      //仓库列表
      {
          path: '/projectrepositories',
          name: 'projectrepositories',
          component: () => import( './views/modules/projectrepositories.vue')
      },
      //仓库详细-代码
      {
          path: '/repositorydetail',
          name: 'repositorydetail',
          component: () => import( './views/modules/repositorydetail.vue')
      },
      //仓库详细-代码仓库
      {
          path: '/snippets',
          name: 'snippets',
          component: () => import( './views/modules/snippets.vue')
      },
      //代码仓库详细
      {
          path: '/snipperdetails',
          name: 'snipperdetails',
          component: () => import( './views/modules/snipperdetails.vue')
      },
      //成员
      {
          path: '/member',
          name: 'member',
          component: () => import( './views/modules/member.vue')
      },
      //分支列表
      {
          path: '/branch',
          name: 'branch',
          component: () => import( './views/modules/branch.vue')
      },
      //新建文件
      {
          path: '/newfile',
          name: 'newfile',
          component: () => import( './views/modules/newfile.vue')
      },
      //文件信息
      {
          path: '/filedetail',
          name: 'filedetail',
          component: () => import( './views/modules/filedetail.vue')
      },
      //提交记录
      {
          path: '/commiterecord',
          name: 'commiterecord',
          component: () => import( './views/modules/commiterecord.vue')
      },
      //记录列表
      {
          path: '/commiterecordlist',
          name: 'commiterecordlist',
          component: () => import( './views/modules/commiterecordlist.vue')
      },
      //提交记录详情
      {
          path: '/commitdetail',
          name: 'commitdetail',
          component: () => import( './views/modules/commitdetail.vue')
      },
      //片段提交历史
      {
          path: '/snippersrecord',
          name: 'snippersrecord',
          component: () => import( './views/modules/snippersrecord.vue')
      },//片段提交历史详情
      {
          path: '/snipperrecorddetail',
          name: 'snipperrecorddetail',
          component: () => import( './views/modules/snipperrecorddetail.vue')
      },
      //邀请列表
      {
          path: '/messagelist',
          name: 'messagelist',
          component: () => import( './views/modules/messagelist.vue')
      },
      //添加ssh
      {
          path: '/creatssh',
          name: 'creatssh',
          component: () => import( './views/modules/creatssh.vue')
      },
      //合并请求列表
      {
          path: '/MergeList',
          name: 'MergeList',
          component: () => import( './views/modules/mergelist.vue')
      },
      //合并请求
      {
          path: '/merge',
          name: 'merge',
          component: () => import( './views/modules/merge.vue')
      },
      //搜索
      {
          path: '/SearchPage',
          name: 'SearchPage',
          component: () => import( './views/modules/searchlist.vue')
      }

  ]
})
