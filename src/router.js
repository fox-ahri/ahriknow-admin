import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'
import Error404 from './views/404.vue'

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            name: 'home',
            alias: '/admin',
            component: Home
        },
        {
            path: '/auth',
            name: 'auth',
            component: () =>
                import ( /* webpackChunkName: "auth" */ './views/Auth.vue'),
            redirect: "/auth/login",
            children: [{
                path: 'login',
                name: 'auth-login',
                component: () =>
                    import ( /* webpackChunkName: "auth-login" */ './views/auth/Login.vue'),
            }, {
                path: 'register',
                name: 'auth-register',
                component: () =>
                    import ( /* webpackChunkName: "auth-register" */ './views/auth/Register.vue'),
            }, {
                path: 'verification',
                name: 'auth-verification',
                component: () =>
                    import ( /* webpackChunkName: "auth-verification" */ './views/auth/Verification.vue'),
            }]
        },
        {
            path: '/userinfo',
            name: 'userinfo',
            component: () =>
                import ( /* webpackChunkName: "userinfo" */ './views/Userinfo.vue')
        }, {
            path: '/ahridata',
            name: 'ahridata',
            meta: {
                required: true
            },
            component: () =>
                import ( /* webpackChunkName: "ahridata" */ './views/AhriData.vue'),
            redirect: "/ahridata/survey",
            children: [{
                path: 'survey',
                name: 'ahridata-survey',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "ahridata-survey" */ './views/ahridata/Survey.vue'),
            }, {
                path: 'collection',
                name: 'ahridata-collection',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "ahridata-collection" */ './views/ahridata/Collection.vue'),
            }, {
                path: 'filedata',
                name: 'ahridata-filedata',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "ahridata-filedata" */ './views/ahridata/Filedata.vue'),
            }]
        },
        {
            path: '/blog',
            name: 'blog',
            meta: {
                required: true
            },
            component: () =>
                import ( /* webpackChunkName: "blog" */ './views/Blog.vue'),
            redirect: "/blog/survey",
            children: [{
                path: 'survey',
                name: 'blog-survey',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "blog-survey" */ './views/blog/Survey.vue'),
            }, {
                path: 'manage',
                name: 'blog-manage',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "blog-manage" */ './views/blog/Manage.vue'),
            }]
        }, {
            path: '/database',
            name: 'database',
            meta: {
                required: true
            },
            component: () =>
                import ( /* webpackChunkName: "database" */ './views/Database.vue'),
            redirect: "/database/survey",
            children: [{
                path: 'survey',
                name: 'database-survey',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "database-survey" */ './views/database/Survey.vue'),
            }]
        }, {
            path: '/notebook',
            name: 'notebook',
            meta: {
                required: true
            },
            component: () =>
                import ( /* webpackChunkName: "notebook" */ './views/Notebook.vue'),
            redirect: "/notebook/book",
            children: [{
                path: 'book',
                name: 'notebook-book',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "notebook-book" */ './views/notebook/Book.vue'),
            }, {
                path: 'document',
                name: 'notebook-document',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "notebook-document" */ './views/notebook/Document.vue'),
            }]
        }, {
            path: '/restful',
            name: 'restful',
            meta: {
                required: true
            },
            component: () =>
                import ( /* webpackChunkName: "restful" */ './views/Restful.vue'),
            redirect: "/restful/survey",
            children: [{
                path: 'survey',
                name: 'restful-survey',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "restful-survey" */ './views/restful/Survey.vue'),
            }, {
                path: 'api',
                name: 'restful-api',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "restful-api" */ './views/restful/Api.vue'),
            }]
        }, {
            path: '/setting',
            name: 'setting',
            meta: {
                required: true
            },
            component: () =>
                import ( /* webpackChunkName: "setting" */ './views/Blog.vue'),
            redirect: "/setting/document",
            children: [{
                path: 'user',
                name: 'setting-user',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "setting-user" */ './views/setting/UserManage.vue'),
            }, {
                path: 'document',
                name: 'setting-document',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "setting-document" */ './views/setting/Document.vue'),
            }, {
                path: 'apply',
                name: 'setting-apply',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "setting-apply" */ './views/setting/Apply.vue'),
            }, {
                path: 'friend',
                name: 'setting-friend',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "setting-friend" */ './views/setting/FriendLink.vue'),
            }]
        }, {
            path: '/transfer',
            name: 'transfer',
            meta: {
                required: true
            },
            component: () =>
                import ( /* webpackChunkName: "transfer" */ './views/Transfer.vue'),
            redirect: "/transfer/galaxy",
            children: [{
                path: 'galaxy',
                name: 'transfer-galaxy',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "transfer-galaxy" */ './views/transfer/Galaxy.vue'),
            }]
        }, {
            path: '/website',
            name: 'website',
            meta: {
                required: true
            },
            component: () =>
                import ( /* webpackChunkName: "website" */ './views/WebSite.vue'),
            redirect: "/website/survey",
            children: [{
                path: 'survey',
                name: 'website-survey',
                meta: {
                    required: true
                },
                component: () =>
                    import ( /* webpackChunkName: "website-survey" */ './views/website/Survey.vue'),
            }]
        }, {
            path: '/dbm',
            name: 'dbm',
            component: () =>
                import ( /* webpackChunkName: "dbm" */ './views/DBM.vue'),
            redirect: "/dbm/mysql-auth",
            children: [{
                path: 'mysql-auth',
                name: 'dbm-mysql-auth',
                component: () =>
                    import ( /* webpackChunkName: "dbm-mysql-auth" */ './views/dbm/mysql/Auth.vue'),
            }, {
                path: 'mysql-mysql',
                name: 'dbm-mysql-mysql',
                component: () =>
                    import ( /* webpackChunkName: "dbm-mysql-mysql" */ './views/dbm/mysql/Mysql.vue'),
            }, {
                path: 'mongo-auth',
                name: 'dbm-mongo-auth',
                component: () =>
                    import ( /* webpackChunkName: "dbm-mongo-auth" */ './views/dbm/mongo/Auth.vue'),
            }, {
                path: 'mongo-mongo',
                name: 'dbm-mongo-mongo',
                component: () =>
                    import ( /* webpackChunkName: "dbm-mongo-mongo" */ './views/dbm/mongo/Mongo.vue'),
            }]
        }, {
            path: '/tools',
            name: 'tools',
            component: () =>
                import ( /* webpackChunkName: "tools" */ './views/Tools.vue'),
            redirect: "/tools/secrecy",
            children: [{
                path: 'secrecy',
                name: 'tools-secrecy',
                component: () =>
                    import ( /* webpackChunkName: "tools-secrecy" */ './views/tools/Secrecy.vue'),
            }, {
                path: 'image',
                name: 'tools-image',
                component: () =>
                    import ( /* webpackChunkName: "tools-image" */ './views/tools/Image.vue'),
            }]
        },
        {
            path: '*',
            name: '404',
            component: Error404
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (from.path != "/auth/login" && from.path != "/auth/register") {
        localStorage.setItem("from", from.path);
    }
    let is_login = store.state.user || false;
    if (to.meta.required) {
        if (is_login && is_login.role >= 10) {
            next();
        } else {
            next('/auth/login');
        }
    } else {
        next();
    }
})

export default router;