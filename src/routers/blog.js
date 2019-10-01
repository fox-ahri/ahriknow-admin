const blog = [
    {
        path: '/blog',
        name: 'blog',
        meta: {
            required: true
        },
        component: () => import(/* webpackChunkName: "blog" */ '../views/Blog.vue'),
        redirect: "/blog/survey",
        children: [{
            path: 'survey',
            name: 'blog-survey',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "blog-survey" */ '../views/blog/Survey.vue'),
        }, {
            path: 'manage',
            name: 'blog-manage',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "blog-manage" */ '../views/blog/Manage.vue'),
        }]
    }
]
export default blog