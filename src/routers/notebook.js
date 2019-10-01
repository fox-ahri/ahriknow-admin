const notebook = [
    {
        path: '/notebook',
        name: 'notebook',
        meta: {
            required: true
        },
        component: () => import(/* webpackChunkName: "notebook" */ '../views/Notebook.vue'),
        redirect: "/notebook/book",
        children: [{
            path: 'book',
            name: 'notebook-book',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "notebook-book" */ '../views/notebook/Book.vue'),
        }, {
            path: 'document',
            name: 'notebook-document',
            meta: {
                required: true
            },
            component: () => import(/* webpackChunkName: "notebook-document" */ '../views/notebook/Document.vue'),
        }]
    }
]
export default notebook