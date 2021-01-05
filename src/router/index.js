/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } },
    { path: '/product-attrupdate', component: _import('modules/product/attrupdate'), name: 'attr-update', meta: { title: '规格维护', isTab: true } }
  ],
  beforeEnter(to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    // http({
    //   url: http.adornUrl('/sys/menu/nav'),
    //   method: 'get',
    //   params: http.adornParams()
    // }).then(({ data }) => {
    //   if (data && data.code === 0) {
    //     fnAddDynamicMenuRoutes(data.menuList)
    //     router.options.isAddDynamicMenuRoutes = true
    //     sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
    //     sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
    //     next({ ...to, replace: true })
    //   } else {
    //     sessionStorage.setItem('menuList', '[]')
    //     sessionStorage.setItem('permissions', '[]')
    //     next()
    //   }
    // }).catch((e) => {
    //   console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
    //   router.push({ name: 'login' })
    // })
		var data = homeData
		if (data && data.code === 0) {
		  fnAddDynamicMenuRoutes(data.menuList)
		  router.options.isAddDynamicMenuRoutes = true
		  sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
		  sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
		  next({ ...to, replace: true })
		} else {
		  sessionStorage.setItem('menuList', '[]')
		  sessionStorage.setItem('permissions', '[]')
		  next()
		}
  }
})

const homeData = {
  "msg": "success",
  "code": 0,
  "menuList": [{
    "menuId": 1,
    "parentId": 0,
    "parentName": null,
    "name": "系统管理",
    "url": null,
    "perms": null,
    "type": 0,
    "icon": "system",
    "orderNum": 0,
    "open": null,
    "list": [{
      "menuId": 2,
      "parentId": 1,
      "parentName": null,
      "name": "管理员列表",
      "url": "sys/user",
      "perms": null,
      "type": 1,
      "icon": "admin",
      "orderNum": 1,
      "open": null,
      "list": null
    },
      {
        "menuId": 3,
        "parentId": 1,
        "parentName": null,
        "name": "角色管理",
        "url": "sys/role",
        "perms": null,
        "type": 1,
        "icon": "role",
        "orderNum": 2,
        "open": null,
        "list": null
      },
      {
        "menuId": 4,
        "parentId": 1,
        "parentName": null,
        "name": "菜单管理",
        "url": "sys/menu",
        "perms": null,
        "type": 1,
        "icon": "menu",
        "orderNum": 3,
        "open": null,
        "list": null
      },
      {
        "menuId": 5,
        "parentId": 1,
        "parentName": null,
        "name": "SQL监控",
        "url": "http://localhost:8080/renren-fast/druid/sql.html",
        "perms": null,
        "type": 1,
        "icon": "sql",
        "orderNum": 4,
        "open": null,
        "list": null
      },
      {
        "menuId": 6,
        "parentId": 1,
        "parentName": null,
        "name": "定时任务",
        "url": "job/schedule",
        "perms": null,
        "type": 1,
        "icon": "job",
        "orderNum": 5,
        "open": null,
        "list": null
      },
      {
        "menuId": 27,
        "parentId": 1,
        "parentName": null,
        "name": "参数管理",
        "url": "sys/config",
        "perms": "sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete",
        "type": 1,
        "icon": "config",
        "orderNum": 6,
        "open": null,
        "list": null
      },
      {
        "menuId": 30,
        "parentId": 1,
        "parentName": null,
        "name": "文件上传",
        "url": "oss/oss",
        "perms": "sys:oss:all",
        "type": 1,
        "icon": "oss",
        "orderNum": 6,
        "open": null,
        "list": null
      },
      {
        "menuId": 29,
        "parentId": 1,
        "parentName": null,
        "name": "系统日志",
        "url": "sys/log",
        "perms": "sys:log:list",
        "type": 1,
        "icon": "log",
        "orderNum": 7,
        "open": null,
        "list": null
      }]
  },
    {
      "menuId": 2,
      "parentId": 0,
      "parentName": null,
      "name": "优惠券管理",
      "url": null,
      "perms": null,
      "type": 0,
      "icon": "system",
      "orderNum": 0,
      "open": null,
      "list": [{
        "menuId": 100,
        "parentId": 2,
        "parentName": null,
        "name": "bounds",
        "url": "coupon/bounds",
        "perms": null,
        "type": 1,
        "icon": "admin",
        "orderNum": 1,
        "open": null,
        "list": null
      },
        {
          "menuId": 101,
          "parentId": 2,
          "parentName": null,
          "name": "优惠券",
          "url": "coupon/coupon",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        },
        {
          "menuId": 102,
          "parentId": 2,
          "parentName": null,
          "name": "couponspucategoryrelation",
          "url": "coupon/couponspucategoryrelation",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 103,
          "parentId": 2,
          "parentName": null,
          "name": "couponspurelation",
          "url": "coupon/couponspurelation",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 104,
          "parentId": 2,
          "parentName": null,
          "name": "full",
          "url": "coupon/full",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 105,
          "parentId": 2,
          "parentName": null,
          "name": "history",
          "url": "coupon/history",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 106,
          "parentId": 2,
          "parentName": null,
          "name": "homeadv",
          "url": "coupon/homeadv",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 107,
          "parentId": 2,
          "parentName": null,
          "name": "homesubjectspu",
          "url": "coupon/homesubjectspu",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 108,
          "parentId": 2,
          "parentName": null,
          "name": "memberprice",
          "url": "coupon/memberprice",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 109,
          "parentId": 2,
          "parentName": null,
          "name": "seckill",
          "url": "coupon/seckill",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 110,
          "parentId": 2,
          "parentName": null,
          "name": "seckillsession",
          "url": "coupon/seckillsession",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 111,
          "parentId": 2,
          "parentName": null,
          "name": "seckillskunotice",
          "url": "coupon/seckillskunotice",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 112,
          "parentId": 2,
          "parentName": null,
          "name": "seckillskurelation",
          "url": "coupon/seckillskurelation",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 113,
          "parentId": 2,
          "parentName": null,
          "name": "skuladder",
          "url": "coupon/skuladder",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 114,
          "parentId": 2,
          "parentName": null,
          "name": "subject",
          "url": "coupon/subject",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        }]
    },
    {
      "menuId": 4,
      "parentId": 0,
      "parentName": null,
      "name": "商品管理",
      "url": null,
      "perms": null,
      "type": 0,
      "icon": "system",
      "orderNum": 0,
      "open": null,
      "list": [{
        "menuId": 400,
        "parentId": 4,
        "parentName": null,
        "name": "attr-group-relation",
        "url": "product/attr-group-relation",
        "perms": null,
        "type": 1,
        "icon": "admin",
        "orderNum": 1,
        "open": null,
        "list": null
      },
        {
          "menuId": 401,
          "parentId": 4,
          "parentName": null,
          "name": "attrgroup",
          "url": "product/attrgroup",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        },
        {
          "menuId": 402,
          "parentId": 4,
          "parentName": null,
          "name": "添加商品",
          "url": "product/spuadd",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 403,
          "parentId": 4,
          "parentName": null,
          "name": "商品信息",
          "url": "product/spuinfo",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 404,
          "parentId": 4,
          "parentName": null,
          "name": "spu",
          "url": "product/spu",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 405,
          "parentId": 4,
          "parentName": null,
          "name": "category",
          "url": "product/category",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 406,
          "parentId": 4,
          "parentName": null,
          "name": "品牌管理",
          "url": "product/brand",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 407,
          "parentId": 4,
          "parentName": null,
          "name": "baseattr",
          "url": "product/baseattr",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 408,
          "parentId": 4,
          "parentName": null,
          "name": "manager",
          "url": "product/manager",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        }]
    },
    {
      "menuId": 3,
      "parentId": 0,
      "parentName": null,
      "name": "订单管理",
      "url": null,
      "perms": null,
      "type": 0,
      "icon": "system",
      "orderNum": 0,
      "open": null,
      "list": [{
        "menuId": 300,
        "parentId": 3,
        "parentName": null,
        "name": "orderitem",
        "url": "order/orderitem",
        "perms": null,
        "type": 1,
        "icon": "admin",
        "orderNum": 1,
        "open": null,
        "list": null
      },
        {
          "menuId": 301,
          "parentId": 3,
          "parentName": null,
          "name": "订单",
          "url": "order/order",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        },
        {
          "menuId": 302,
          "parentId": 3,
          "parentName": null,
          "name": "orderreturnreason",
          "url": "order/orderreturnreason",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 303,
          "parentId": 3,
          "parentName": null,
          "name": "订单操作记录",
          "url": "order/orderoperatehistory",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 304,
          "parentId": 3,
          "parentName": null,
          "name": "付款",
          "url": "order/payment",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 305,
          "parentId": 3,
          "parentName": null,
          "name": "付款更新",
          "url": "order/paymentinfo-add-or-update",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 306,
          "parentId": 3,
          "parentName": null,
          "name": "退款",
          "url": "order/refund",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 308,
          "parentId": 3,
          "parentName": null,
          "name": "退货",
          "url": "order/return",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        },
        {
          "menuId": 309,
          "parentId": 3,
          "parentName": null,
          "name": "商品设置",
          "url": "order/settings",
          "perms": null,
          "type": 1,
          "icon": "menu",
          "orderNum": 3,
          "open": null,
          "list": null
        }]
    },
    {
      "menuId": 5,
      "parentId": 0,
      "parentName": null,
      "name": "member",
      "url": null,
      "perms": null,
      "type": 0,
      "icon": "system",
      "orderNum": 0,
      "open": null,
      "list": [{
        "menuId": 500,
        "parentId": 5,
        "parentName": null,
        "name": "member",
        "url": "member/member",
        "perms": null,
        "type": 1,
        "icon": "admin",
        "orderNum": 1,
        "open": null,
        "list": null
      },
        {
          "menuId": 501,
          "parentId": 5,
          "parentName": null,
          "name": "level",
          "url": "member/level",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        }]
    },
    {
      "menuId": 6,
      "parentId": 0,
      "parentName": null,
      "name": "ware",
      "url": null,
      "perms": null,
      "type": 0,
      "icon": "system",
      "orderNum": 0,
      "open": null,
      "list": [{
        "menuId": 600,
        "parentId": 6,
        "parentName": null,
        "name": "purchase",
        "url": "ware/purchase",
        "perms": null,
        "type": 1,
        "icon": "admin",
        "orderNum": 1,
        "open": null,
        "list": null
      },
        {
          "menuId": 601,
          "parentId": 6,
          "parentName": null,
          "name": "purchaseitem",
          "url": "ware/purchaseitem",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        },
        {
          "menuId": 602,
          "parentId": 6,
          "parentName": null,
          "name": "sku",
          "url": "ware/sku",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        },
        {
          "menuId": 603,
          "parentId": 6,
          "parentName": null,
          "name": "task",
          "url": "ware/task",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        },
        {
          "menuId": 604,
          "parentId": 6,
          "parentName": null,
          "name": "wareinfo",
          "url": "ware/wareinfo",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        },
        {
          "menuId": 605,
          "parentId": 6,
          "parentName": null,
          "name": "wareordertaskdetail",
          "url": "ware/wareordertaskdetail",
          "perms": null,
          "type": 1,
          "icon": "role",
          "orderNum": 2,
          "open": null,
          "list": null
        }]
    }],
  "permissions": ["sys:schedule:info",
    "sys:menu:update",
    "sys:menu:delete",
    "sys:config:info",
    "sys:menu:list",
    "sys:config:save",
    "sys:config:update",
    "sys:schedule:resume",
    "sys:user:delete",
    "sys:config:list",
    "sys:user:update",
    "sys:role:list",
    "sys:menu:info",
    "sys:menu:select",
    "sys:schedule:update",
    "sys:schedule:save",
    "sys:role:select",
    "sys:user:list",
    "sys:menu:save",
    "sys:role:save",
    "sys:schedule:log",
    "sys:role:info",
    "sys:schedule:delete",
    "sys:role:update",
    "sys:schedule:list",
    "sys:user:info",
    "sys:schedule:run",
    "sys:config:delete",
    "sys:role:delete",
    "sys:user:save",
    "sys:schedule:pause",
    "sys:log:list",
    "sys:oss:all"]
}

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) { }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
