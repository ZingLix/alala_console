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
    component: './404',
  },
];
