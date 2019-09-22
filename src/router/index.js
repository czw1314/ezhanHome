export default {
    menus: [ // 菜单相关路由
        { key: '/homePage', title: '首页', component: 'HomePage' },
        { key: '/home/bridalChamber', title: '找新房' },
        { key: '/home/agent', title: '找经纪人', component: 'agent' },
        { key: '/home/aboutUs', title: '关于我们', component: 'aboutUs' },
    ],
    bridalMenus: [ // 菜单相关路由
        { key: '/home/bridalHome/bridalIndex', title: '楼盘首页', component: 'HomePage' },
        // { key: '/home/bridalHome/bridalDetails', title: '楼盘详情', component: 'bridalChamber' },
        { key: '/home/bridalHome/bridalAlbum', title: '楼盘相册', component: 'agent' },
        // { key: '/home/bridalHome/bridalSet', title: '楼盘配套', component: 'aboutUs' },
        { key: '/home/bridalHome/bridalApartment', title: '楼盘户型', component: 'aboutUs' },
    ],
    others: [ { key: '/main/login', title: '登陆', component: 'login' },] // 非菜单相关路由
}