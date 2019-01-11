let navConfig = [
    {
        text: '系统设置',
        url: '/home',
        icon: 'icon-system',
        active: true,
        open: true
    },
    {
        text: '基础档案',
        url: '/record',
        icon: 'icon-record',
        paraent: true,
        open: false,
        active: false,
        children: [
            {
                text: '校区档案',
                url: '/record',
                role: ''
            },
            {
                text: '学生档案',
                url: '/record/student',
                role: ''
            },
            {
                text: '教师档案',
                url: '/record/teacher',
                role: ''
            },
           
        ]
    },
    {
        text: '会员系统',
        url: '/record/teacher',
        icon: 'icon-paiming',
        active: false,
    },
    {
        text: '人员管理',
        url: '',
        icon: 'icon-shangcheng1',
        active: false,
        link: 'http'
    },
    {
        text: '教务管理',
        url: '/wealth',
        icon: 'icon-cloud-treasure',
        open: false,
        paraent: true,
        active: false,
        children: [
            {
                text: '名师推荐',
                url: '/wealth/index',
                role: ''
            },
            {
                text: '热门报名',
                url: '/wealth/capital',
                role: ''
            }
        ]
    },
    {
        text: '订单系统',
        url: '/settings',
        active: false,
        icon: 'icon-order',
        open: false,
    },
    {
        text: '退出登录',
        url: '/logout',
        active: false,
        icon: 'icon-tuichu',
    }
];


export default navConfig