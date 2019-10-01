const setting = [
    {
        path: '/setting',
        name: 'setting',
        meta: {
            required: true
        },
        component: () => import(/* webpackChunkName: "setting" */ '../views/Blog.vue'),
        redirect: "/setting/user",
        children: [{
            path: 'user',
            name: 'setting-user',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "setting-user" */ '../views/setting/UserManage.vue'),
        }]
    }
]
export default setting