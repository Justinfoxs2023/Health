export const navigationConfig = {
  mainMenu: [
    {
      key: 'dashboard',
      path: '/dashboard',
      icon: 'DashboardIcon',
      title: '健康总览',
      permissions: ['user'],
    },
    {
      key: 'member',
      path: '/member',
      icon: 'MemberIcon',
      title: '会员中心',
      permissions: ['user'],
      children: [
        {
          key: 'privileges',
          path: '/member/privileges',
          title: '我的权益',
        },
        {
          key: 'bookings',
          path: '/member/bookings',
          title: '我的预约',
        },
      ],
    },
    {
      key: 'consultation',
      path: '/consultation',
      icon: 'ConsultationIcon',
      title: '在线咨询',
      permissions: ['user'],
      children: [
        {
          key: 'doctors',
          path: '/consultation/doctors',
          title: '找医生',
        },
        {
          key: 'records',
          path: '/consultation/records',
          title: '咨询记录',
        },
      ],
    },
    {
      key: 'community',
      path: '/community',
      icon: 'CommunityIcon',
      title: '健康社区',
      permissions: ['user'],
      children: [
        {
          key: 'activities',
          path: '/community/activities',
          title: '社区动态',
        },
        {
          key: 'challenges',
          path: '/community/challenges',
          title: '健康挑战',
        },
      ],
    },
  ],
  
  mobileMenu: [
    {
      key: 'home',
      path: '/',
      icon: 'HomeIcon',
      title: '首页',
    },
    {
      key: 'services',
      path: '/services',
      icon: 'ServicesIcon',
      title: '服务',
    },
    {
      key: 'community',
      path: '/community',
      icon: 'CommunityIcon',
      title: '社区',
    },
    {
      key: 'profile',
      path: '/profile',
      icon: 'ProfileIcon',
      title: '我的',
    },
  ],
}; 