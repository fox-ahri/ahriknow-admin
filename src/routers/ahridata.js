const ahridata = [
    {
        path: '/ahridata',
        name: 'ahridata',
        meta: {
            required: true
        },
        component: () => import(/* webpackChunkName: "ahridata" */ '../views/AhriData.vue'),
        redirect: "/ahridata/survey",
        children: [{
            path: 'survey',
            name: 'ahridata-survey',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "ahridata-survey" */ '../views/ahridata/Survey.vue'),
        }, {
            path: 'collection',
            name: 'ahridata-collection',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "ahridata-collection" */ '../views/ahridata/Collection.vue'),
        }, {
            path: 'filedata',
            name: 'ahridata-filedata',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "ahridata-filedata" */ '../views/ahridata/Filedata.vue'),
        }]
    }
]
export default ahridata