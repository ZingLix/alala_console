export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    redirect: '/rule',
  },
  {
    name: 'ruleManager',
    icon: 'smile',
    path: '/rule',
    component: './RulesManager',
  },
  {
    name: 'keywordsManager',
    icon: 'smile',
    path: '/keywords',
    component: './KeywordsManager',
  },
  {
    name: 'biliMonitor',
    icon: 'smile',
    path: '/bilimonitor',
    component: './BiliMonitor',
  },
  {
    name: 'permissionManager',
    icon: 'smile',
    path: '/permission',
    component: './PermissionManager',
  },
  {
    component: './404',
  },
];
