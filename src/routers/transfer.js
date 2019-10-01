const notebook = [
    {
        path: '/transfer',
        name: 'transfer',
        meta: {
            required: true
        },
        component: () => import(/* webpackChunkName: "transfer" */ '../views/Transfer.vue'),
        redirect: "/transfer/galaxy",
        children: [{
            path: 'galaxy',
            name: 'transfer-galaxy',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "transfer-galaxy" */ '../views/transfer/Galaxy.vue'),
        }]
    }
]
export default notebook